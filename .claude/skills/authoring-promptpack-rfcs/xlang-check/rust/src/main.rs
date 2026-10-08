use std::{env, fs};
fn main() {
    let a: Vec<String> = env::args().collect();
    let schema: serde_json::Value = serde_json::from_str(&fs::read_to_string(&a[1]).unwrap()).unwrap();
    let mut ok = true;
    for (label, strict_regex) in [("rust-jsonschema-fancy", false), ("rust-jsonschema-regex", true)] {
        let mut o = jsonschema::draft202012::options();
        if strict_regex { o = o.with_pattern_options(jsonschema::PatternOptions::regex()); }
        let v = match o.should_validate_formats(true).build(&schema) {
            Ok(v) => v,
            Err(e) => { println!("FAIL {label}: compile: {e}"); ok = false; continue; }
        };
        let mut files: Vec<_> = fs::read_dir(&a[2]).unwrap().map(|e| e.unwrap().path()).filter(|p| p.extension().is_some_and(|x| x == "json")).collect();
        files.sort();
        for f in files {
            let name = f.file_name().unwrap().to_string_lossy().to_string();
            let inst: serde_json::Value = serde_json::from_str(&fs::read_to_string(&f).unwrap()).unwrap();
            let good = v.is_valid(&inst) == name.starts_with("valid");
            ok &= good;
            println!("{} {label} {name}", if good { "PASS" } else { "FAIL" });
        }
    }
    std::process::exit(if ok { 0 } else { 1 });
}
