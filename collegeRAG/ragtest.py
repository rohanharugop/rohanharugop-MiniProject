import rag

resp = rag.call_rag("Recommend 3 engineering courses offered by engineering colleges for a student who's intersted in maths and physics and has a general rank 0f 1500, calculate and include an average the cutoff pf the course you have selected. If any data is ambiguous, leave it and answer the rest of the question instead")
print(resp['result'])