; Larimar injection queries for Tree-sitter
; Injections are used to embed one language within another

; Interpolation in strings contains Larimar expressions
(interpolation
  (expression) @injection.content
  (#set! injection.language "larimar"))
