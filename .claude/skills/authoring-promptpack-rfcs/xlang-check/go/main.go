package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	st "github.com/santhosh-tekuri/jsonschema/v6"
	"github.com/xeipuuv/gojsonschema"
)

func main() {
	schemaPath, dir := os.Args[1], os.Args[2]
	raw, _ := os.ReadFile(schemaPath)
	files, _ := filepath.Glob(filepath.Join(dir, "*.json"))
	ok := true

	// 1. gojsonschema — the library PromptKit uses.
	gs, err := gojsonschema.NewSchema(gojsonschema.NewBytesLoader(raw))
	if err != nil {
		fmt.Println("FAIL gojsonschema: schema load:", err)
		ok = false
	} else {
		for _, f := range files {
			doc, _ := os.ReadFile(f)
			res, err := gs.Validate(gojsonschema.NewBytesLoader(doc))
			ok = report("gojsonschema", f, err == nil && res.Valid(), fmt.Sprint(err, res)) && ok
		}
	}

	// 2. santhosh-tekuri/jsonschema v6 — strict draft 2020-12.
	var sdoc any
	_ = json.Unmarshal(raw, &sdoc)
	c := st.NewCompiler()
	c.AssertFormat()
	if err := c.AddResource("schema.json", sdoc); err != nil {
		fmt.Println("FAIL santhosh: add:", err)
		ok = false
	} else if sch, err := c.Compile("schema.json"); err != nil {
		fmt.Println("FAIL santhosh: compile:", err)
		ok = false
	} else {
		for _, f := range files {
			doc, _ := os.ReadFile(f)
			inst, _ := st.UnmarshalJSON(bytes.NewReader(doc))
			err := sch.Validate(inst)
			ok = report("santhosh-v6", f, err == nil, fmt.Sprint(err)) && ok
		}
	}
	if !ok {
		os.Exit(1)
	}
}

func report(lib, f string, valid bool, detail string) bool {
	want := strings.HasPrefix(filepath.Base(f), "valid")
	good := valid == want
	if good {
		fmt.Println("PASS", lib, filepath.Base(f))
	} else {
		fmt.Println("FAIL", lib, filepath.Base(f), detail)
	}
	return good
}
