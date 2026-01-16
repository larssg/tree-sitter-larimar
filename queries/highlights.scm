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

(interpolation) @punctuation.special

(boolean) @constant.builtin

; ============================================
; KEYWORDS
; ============================================

; Control flow
"if" @keyword.conditional
"elsif" @keyword.conditional
"else" @keyword.conditional
"unless" @keyword.conditional
"then" @keyword.conditional
"match" @keyword.conditional
"end" @keyword.conditional

; Loops
"for" @keyword.repeat
"in" @keyword.repeat
"while" @keyword.repeat
"loop" @keyword.repeat

; Control flow statements
"return" @keyword.return
"break" @keyword.return
"continue" @keyword.return

; Async
"spawn" @keyword.coroutine
"await" @keyword.coroutine
"async" @keyword.coroutine

; Imports
"use" @keyword.import

; Logical operators as keywords
"and" @keyword.operator
"or" @keyword.operator
"not" @keyword.operator

; Definition keywords
"def" @keyword.function

; Type definition keywords
"struct" @keyword.type
"class" @keyword.type
"enum" @keyword.type
"trait" @keyword.type
"impl" @keyword.type
"module" @keyword.type
"type" @keyword.type

; Storage modifiers
"let" @keyword.modifier
"mut" @keyword.modifier
"inline" @keyword.modifier

; Visibility
"pub" @keyword.modifier
"private" @keyword.modifier
"protected" @keyword.modifier

; ============================================
; TYPES
; ============================================

(type_identifier) @type

; ============================================
; FUNCTIONS AND METHODS
; ============================================

; Function definitions
(function_definition
  name: (identifier) @function)

; Function calls
(call_expression
  function: (identifier) @function.call)

(method_call
  method: (identifier) @function.method.call)

; ============================================
; VARIABLES
; ============================================

(identifier) @variable

(self) @variable.builtin
(super) @variable.builtin

(instance_variable) @variable.member

; Parameters
(parameter
  name: (identifier) @variable.parameter)

(block_params
  (identifier) @variable.parameter)

; ============================================
; PUNCTUATION
; ============================================

["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["," "." ":" ";"] @punctuation.delimiter

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
  name: (type_identifier) @type.definition)

; Enum variants
(enum_variant
  name: (type_identifier) @constant)

; Struct fields
(struct_field
  name: (identifier) @property)

(field_init
  name: (identifier) @property)

; ============================================
; PATTERNS
; ============================================

"_" @variable.builtin

(typed_pattern
  (identifier) @variable)
