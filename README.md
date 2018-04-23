# posit-javascript

plookup.html (js/decimallookupv2.js) - Convert decimal to posit (6, 8, 16, 32 bits) with exponential size of 1 to 4 bits. Demonstrate rounding as per recommended by John Gustafson (without overflow and underflow). 

lookup.html (js/positlookup.js) - Generate lookup table for posits of size 2 to 16 with exponential size of 1-4 bits.

Live version:

Posit Lookup Table: https://posithub.org/widget/lookup 

Conversion: Decimal to Posit with correct rounding based on posit standard: https://posithub.org/widget/plookup (Please note that this code is only accurate/correct if the given decimal can be represented by a 64-bit double without rounding).
