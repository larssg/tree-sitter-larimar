# Tree-sitter Larimar

Tree-sitter grammar for the [Larimar](https://github.com/your-username/larimar-lang) programming language.

## Features

Larimar is a Ruby-inspired programming language with:
- Static typing with inference
- Null-safety via `Option[T]`
- Enums with associated data (ADTs)
- Pattern matching
- Compile-time metaprogramming
- Safe concurrency

## Installation

### npm

```bash
npm install tree-sitter-larimar
```

### Build from Source

```bash
git clone https://github.com/your-username/tree-sitter-larimar
cd tree-sitter-larimar
npm install
npm run build
```

## Usage

### Node.js

```javascript
const Parser = require('tree-sitter');
const Larimar = require('tree-sitter-larimar');

const parser = new Parser();
parser.setLanguage(Larimar);

const sourceCode = `
def greet(name: String) -> String
  "Hello, #{name}!"
end
`;

const tree = parser.parse(sourceCode);
console.log(tree.rootNode.toString());
```

### CLI

```bash
# Parse a file
tree-sitter parse examples/hello.lar

# Highlight a file
tree-sitter highlight examples/hello.lar

# Run tests
tree-sitter test
```

## Grammar Overview

The grammar supports all Larimar language constructs:

### Statements
- Variable declarations: `let x = 42`, `let mut counter = 0`
- Function definitions: `def add(a: Int, b: Int) -> Int`
- Type definitions: `struct`, `class`, `enum`, `trait`, `module`
- Control flow: `if/elsif/else`, `unless`, `match`
- Loops: `for`, `while`, `until`, `loop`
- Imports: `use std::io::File`

### Expressions
- Literals: integers, floats, strings, chars, booleans
- Collections: arrays, hashes, tuples
- Blocks: `{ |x| x * 2 }`, `do |x| ... end`
- Lambdas: `-> (x: Int) { x * 2 }`
- Pattern matching with guards
- Pipe operator: `data |> transform |> save`

### Types
- Primitives: `Int`, `Float`, `String`, `Bool`, `Char`
- Generics: `Array[T]`, `Option[T]`, `Result[T, E]`
- Function types: `Fn(Int, Int) -> Int`
- Union types: `Int | String`
- Optional shorthand: `String?`

## Queries

The grammar includes the following query files:

- `highlights.scm` - Syntax highlighting
- `injections.scm` - Language injections (string interpolation)
- `locals.scm` - Local variable scoping
- `tags.scm` - Code navigation tags

## Development

### Generate the parser

```bash
npm run build
# or
tree-sitter generate
```

### Run tests

```bash
npm test
# or
tree-sitter test
```

### Build WASM

```bash
npm run build-wasm
# or
tree-sitter build --wasm
```

## Testing

Create test files in `test/corpus/` following Tree-sitter's test format:

```
================================================================================
Function definition
================================================================================

def add(a: Int, b: Int) -> Int
  a + b
end

--------------------------------------------------------------------------------

(source_file
  (function_definition
    name: (identifier)
    (parameters
      (parameter name: (identifier) type: (type_identifier))
      (parameter name: (identifier) type: (type_identifier)))
    return_type: (type_identifier)
    (binary_expression
      (identifier)
      (identifier))))
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new grammar rules
4. Run `tree-sitter test` to verify
5. Submit a pull request

## License

MIT License
