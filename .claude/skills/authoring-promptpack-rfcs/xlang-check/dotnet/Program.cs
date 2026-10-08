using System.Text.Json.Nodes;
using Json.Schema;
var ok = true;
JsonSchema schema;
try {
    schema = JsonSchema.FromText(File.ReadAllText(args[0]));
    // Force compilation of every subschema, including patterns, by validating the schema against its meta-schema
    // and evaluating a fixture set below.
} catch (Exception e) { Console.WriteLine($"FAIL dotnet: load: {e.Message}"); return 1; }
var opts = new EvaluationOptions { OutputFormat = OutputFormat.List, RequireFormatValidation = true };
var meta = MetaSchemas.Draft202012.Evaluate(System.Text.Json.JsonDocument.Parse(File.ReadAllText(args[0])).RootElement, opts);
if (!meta.IsValid) { Console.WriteLine("FAIL dotnet: schema not valid against 2020-12 metaschema"); ok = false; }
foreach (var f in Directory.GetFiles(args[1], "*.json").OrderBy(x => x)) {
    var name = Path.GetFileName(f);
    try {
        var r = schema.Evaluate(System.Text.Json.JsonDocument.Parse(File.ReadAllText(f)).RootElement, opts);
        var good = r.IsValid == name.StartsWith("valid");
        ok &= good;
        Console.WriteLine($"{(good ? "PASS" : "FAIL")} dotnet-JsonSchema.Net {name}");
    } catch (Exception e) { ok = false; Console.WriteLine($"FAIL dotnet {name}: {e.GetType().Name}: {e.Message}"); }
}
return ok ? 0 : 1;
