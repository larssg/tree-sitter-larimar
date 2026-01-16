; Larimar syntax highlighting queries for Tree-sitter

; ============================================
; COMMENTS
; ============================================

(comment) @comment

; ============================================
; LITERALS
; ============================================

(integer) @number
(float) @number

(string) @string
(char) @string
(escape_sequence) @string.escape

(interpolation
  "#{" @punctuation.special
  "}" @punctuation.special)

(boolean) @constant.builtin
"None" @constant.builtin

; ============================================
; KEYWORDS
; ============================================

; Control flow
[
  "if"
  "elsif"
  "else"
  "unless"
  "then"
  "match"
  "end"
] @keyword.conditional

; Loops
[
  "for"
  "in"
  "while"
  "loop"
] @keyword.repeat

; Control flow
[
  "return"
  "break"
  "continue"
] @keyword.return

; Async
[
  "spawn"
  "await"
  "async"
] @keyword.coroutine

; Imports
"use" @keyword.import

; Other keywords
[
  "as"
] @keyword

; Logical operators as keywords
[
  "and"
  "or"
  "not"
] @keyword.operator

; Definition keywords
"def" @keyword.function

; Type definition keywords
[
  "struct"
  "class"
  "enum"
  "trait"
  "impl"
  "module"
  "type"
] @keyword.type

; Storage modifiers
[
  "let"
  "mut"
  "inline"
] @keyword.modifier

; Visibility
[
  "pub"
  "private"
  "protected"
] @keyword.modifier

; ============================================
; TYPES
; ============================================

(type_identifier) @type

(generic_type
  (type_identifier) @type)

"Self" @type.builtin
"Never" @type.builtin

; Built-in types
((type_identifier) @type.builtin
  (#any-of? @type.builtin
    "Int" "Float" "String" "Bool" "Char"
    "Array" "Hash" "Option" "Result"
    "Any" "Fn"))

; Type parameters
(type_parameter
  name: (type_identifier) @type.parameter)

; ============================================
; FUNCTIONS AND METHODS
; ============================================

; Function definitions
(function_definition
  name: (identifier) @function)

; Function calls
(call_expression
  function: (expression
    (primary_expression
      (identifier) @function.call)))

(method_call
  method: (identifier) @function.method.call)

; Built-in functions
((identifier) @function.builtin
  (#any-of? @function.builtin
    "puts" "print" "gets" "panic" "assert"))

; Some/Ok/Err
[
  "Some"
  "Ok"
  "Err"
] @function.builtin

; ============================================
; VARIABLES
; ============================================

(identifier) @variable

"self" @variable.builtin
"super" @variable.builtin

(instance_variable) @variable.member

; Parameters
(parameter
  name: (identifier) @variable.parameter)

(parameter
  name: (instance_variable) @variable.parameter)

(block_params
  (identifier) @variable.parameter)

; ============================================
; OPERATORS
; ============================================

[
  "+"
  "-"
  "*"
  "/"
  "%"
] @operator

[
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
] @operator

[
  "&&"
  "||"
  "!"
] @operator

[
  "|>"
] @operator

[
  ".."
  "..."
] @operator

[
  "->"
  "=>"
] @operator

[
  "="
] @operator

[
  "::"
] @operator

[
  "|"
  "&"
] @operator

; ============================================
; PUNCTUATION
; ============================================

[
  "("
  ")"
] @punctuation.bracket

[
  "["
  "]"
] @punctuation.bracket

[
  "{"
  "}"
] @punctuation.bracket

[
  ","
  "."
  ":"
  ";"
] @punctuation.delimiter

; Block parameter pipes
(block_params
  "|" @punctuation.bracket)

; ============================================
; DEFINITIONS
; ============================================

; Class/struct/enum/trait/module names
(class_definition
  name: (type_identifier) @type.definition)

(struct_definition
  name: (type_identifier) @type.definition)

(enum_definition
  name: (type_identifier) @type.definition)

(trait_definition
  name: (type_identifier) @type.definition)

(module_definition
  name: (type_identifier) @module)

(type_alias
  name: (type_identifier) @type.definition)

; Enum variants
(enum_variant
  name: (type_identifier) @constant)

; Struct fields
(struct_field
  name: (identifier) @property)

(field_init
  name: (identifier) @property)

(field_pattern
  (identifier) @property)

; ============================================
; PATTERNS
; ============================================

"_" @variable.builtin

(typed_pattern
  (identifier) @variable)

; ============================================
; PATH EXPRESSIONS
; ============================================

(path_expression
  (type_identifier) @type)

; Hash entries
(hash_entry
  "=>" @operator)

; ============================================
; ERRORS
; ============================================

(ERROR) @error
