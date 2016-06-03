## Parses fasta file
## Parses fasta file and the file into a into a csv file with each base laid out

# Load fasta file
fasta = read.table("mus_igf1r.fasta", sep="\t", stringsAsFactors = FALSE)

# Clean up data
fasta = fasta[2:nrow(fasta),]
fasta_line = paste(fasta, sep="", collapse="")

#Create data frane for graphing
graph_df = data.frame(POS = seq(1, nchar(fasta_line)), SEQ = NA)

#Loop to append graph df
for(i in 1:nchar(fasta_line)){
  graph_df$SEQ[i] = substr(fasta_line,i,i)
}

#Plot results
write.csv(graph_df, "../../Input/parsed_sequence.csv", row.names = FALSE)
