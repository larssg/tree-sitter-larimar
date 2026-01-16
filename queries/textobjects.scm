; Larimar textobjects queries for Tree-sitter
; Provides textobject selections for editors

; ============================================
; FUNCTIONS
; ============================================

(function_definition) @function.outer

(function_definition
  body: (_) @function.inner)

(method_definition) @function.outer

(method_definition
  body: (_) @function.inner)

(lambda) @function.outer

(lambda
  body: (_) @function.inner)

(block) @function.outer
(block) @function.inner

; ============================================
; CLASSES
; ============================================

(class_definition) @class.outer
(class_definition body: (_) @class.inner)

(struct_definition) @class.outer
(struct_definition body: (_) @class.inner)

(enum_definition) @class.outer
(enum_definition body: (_) @class.inner)

(trait_definition) @class.outer
(trait_definition body: (_) @class.inner)

(impl_block) @class.outer
(impl_block body: (_) @class.inner)

(module_definition) @class.outer
(module_definition body: (_) @class.inner)

; ============================================
; PARAMETERS
; ============================================

(parameters (parameter) @parameter.inner) @parameter.outer
(arguments (argument) @parameter.inner) @parameter.outer
(block_parameters (block_parameter) @parameter.inner) @parameter.outer

; ============================================
; COMMENTS
; ============================================

(comment) @comment.outer
(comment) @comment.inner

; ============================================
; CONDITIONALS
; ============================================

(if_expression) @conditional.outer
(unless_expression) @conditional.outer
(match_expression) @conditional.outer
(match_arm) @conditional.inner

; ============================================
; LOOPS
; ============================================

(for_expression) @loop.outer
(while_expression) @loop.outer
(until_expression) @loop.outer
(loop_expression) @loop.outer

; ============================================
; STATEMENTS
; ============================================

(statement) @statement.outer

; ============================================
; CALLS
; ============================================

(call_expression) @call.outer
(call_expression arguments: (arguments) @call.inner)

(method_call_expression) @call.outer
(method_call_expression arguments: (arguments) @call.inner)
