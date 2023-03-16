package uk.dynamenusystem.dynamenusystem

class Markdown {
	companion object{
		var orderedListCurrentNumber = 1

		fun convertMarkdownToHTML( currentLine: String, previousLine: String, nextLine: String ): String {
			var newLine = ""

			// block
			val unorderedListMatch = Regex( "\\* (.+)" ).find( currentLine )
			if ( unorderedListMatch != null ) {
				val listText = unorderedListMatch.groupValues[ 1 ]

				newLine += " • $listText"
			}

			val orderedListMatch = Regex( "1\\. (.+)" ).find( currentLine )
			if ( orderedListMatch != null ) {
				val listText = orderedListMatch.groupValues[ 1 ]

				if ( previousLine == "" ) {
					orderedListCurrentNumber = 1
				}

				newLine += "$orderedListCurrentNumber. $listText"

				orderedListCurrentNumber++
			}

			if ( newLine == "" ) {
				newLine = currentLine
			}

			// inline
			newLine = newLine.replace("[*]{2}([^*]+)[*]{2}".toRegex(), "<strong>$1</strong>")
			newLine = newLine.replace("[*]([^*]+)[*]".toRegex(), "<em>$1</em>")
			newLine = newLine.replace("~{2}([^~]+)~{2}".toRegex(), "<strike>$1</strike>")
			newLine = newLine.replace("_{2}([^*]+)_{2}".toRegex(), "<u>$1</u>")
			newLine = newLine.replace("\\[(.*?)\\]\\((.*?)\\)".toRegex(), "<a href=\"$2\">$1</a>")
			newLine = newLine.replace("\\{(#[0-9A-Fa-f]{6}),(.+?)\\}".toRegex(), "<span style=\"color: $1;\">$2</span>")

			return newLine
		}
	}
}