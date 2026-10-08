require 'json_schemer'
require 'json'
schema = JSON.parse(File.read(ARGV[0]))
ok = true
[['ruby-json_schemer-ruby-regexp', 'ruby'], ['ruby-json_schemer-ecma', 'ecma']].each do |label, re|
  begin
    s = JSONSchemer.schema(schema, regexp_resolver: re, format: true)
    raise 'schema invalid against metaschema' unless JSONSchemer.valid_schema?(schema)
  rescue => e
    puts "FAIL #{label}: load: #{e.message[0,200]}"; ok = false; next
  end
  Dir[File.join(ARGV[1], '*.json')].sort.each do |f|
    name = File.basename(f)
    begin
      good = s.valid?(JSON.parse(File.read(f))) == name.start_with?('valid')
    rescue => e
      puts "FAIL #{label} #{name}: #{e.class}: #{e.message[0,200]}"; ok = false; next
    end
    ok &&= good
    puts "#{good ? 'PASS' : 'FAIL'} #{label} #{name}"
  end
end
exit(ok ? 0 : 1)
