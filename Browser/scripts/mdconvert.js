function markdownToHTML(markdownString) {
	let markdownLines = markdownString.split('\n');
	let markdownLinesCount = markdownLines.length;

	let htmlLines = [];

	for (let lineNumber = 0; lineNumber < markdownLinesCount; lineNumber++) {
		let markdownLine = markdownLines[lineNumber];

		let previousLines = markdownLines.slice(0,lineNumber);
		let nextLines = markdownLines.slice(lineNumber+1);

		// Headings
		let didHeadingChange = false;
		[markdownLine,didHeadingChange] = heading(markdownLine)

		// Lists
		let didUnorderedListChange = false;
		[markdownLine,didUnorderedListChange] = unorderedList(markdownLine,previousLines,nextLines);
		let didOrderedListChange = false;
		[markdownLine,didOrderedListChange] = orderedList(markdownLine,previousLines,nextLines);

		if (markdownLine.length <= 0) continue;

		markdownLine = markdownLine.replaceAll(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
		markdownLine = markdownLine.replaceAll(/\*(.*?)\*/g, '<em>$1</em>'); // Italic
		markdownLine = markdownLine.replaceAll(/__(.*?)__/g, '<u>$1</u>'); // Underline
		markdownLine = markdownLine.replaceAll(/~~(.*?)~~/g, '<s>$1</s>'); // Strikethrough
		markdownLine = markdownLine.replaceAll(/!\[(.*?)\]\((.*?)\)/g, '<img src=\'$2\' alt=\'$1\' />'); // Images
		markdownLine = markdownLine.replaceAll(/\[(.*?)\]\((.*?)\)/g, '<a href=\'$2\'>$1</a>'); // Links

		if (didHeadingChange||didUnorderedListChange||didOrderedListChange) {
			htmlLines.push(markdownLine);
		} else {
			htmlLines.push(`<p>${markdownLine}</p>`);
		}
	}

	// Remove empty lines
	htmlLines = htmlLines.filter(function(line){
		return line.length>0;
	});

	return htmlLines.join('\n');
}

function heading(markdownLine){
	for (let count = 6; count >= 1; count--){
		let prefix = '#'.repeat(count);
		if (markdownLine.startsWith(prefix)) {
			return [`<h${count}>${markdownLine.slice(prefix.length)}</h${count}>`,true];
		}
	}

	return [markdownLine, false];
}

function unorderedList(markdownLine,previousLines,nextLines){
	let previousLine = '';
	if (previousLines.length>0){
		previousLine = previousLines[previousLines.length-1];
	}

	let nextLine = '';
	if (nextLines.length>0){
		nextLine = nextLines[0];
	}

	if (markdownLine.startsWith('* ')){
		let listText = markdownLine.slice(2);

		let htmlLine = `<li>${listText}</li>`;
		if (previousLine.length <= 0) {
			htmlLine = `<ul>${htmlLine}`;
		}
		if (nextLine.length <= 0) {
			htmlLine = `${htmlLine}</ul>`;
		}

		return [htmlLine,true];
	}

	return [markdownLine,false];
}

function orderedList(markdownLine,previousLines,nextLines){
	let previousLine = '';
	if (previousLines.length>0){
		previousLine = previousLines[previousLines.length-1];
	}

	let nextLine = '';
	if (nextLines.length>0){
		nextLine = nextLines[0];
	}

	let regexMatch = markdownLine.match(/^\d\. (.+)$/);
	if (regexMatch) {
		let listText = regexMatch[1];

		let htmlLine = `<li>${listText}</li>`;
		if (previousLine.length <= 0) {
			htmlLine = `<ol>${htmlLine}`;
		}
		if (nextLine.length <= 0) {
			htmlLine = `${htmlLine}</ol>`;
		}

		return [htmlLine,true];
	}

	return [markdownLine,false];
}


// old code
function HTMLToMarkdown( htmlText ) {
	htmlText = htmlText.replaceAll( /<h6>(.*)<\/h6>/g, "###### $1" )
	htmlText = htmlText.replaceAll( /<h5>(.*)<\/h5>/g, "##### $1" )
	htmlText = htmlText.replaceAll( /<h4>(.*)<\/h4>/g, "#### $1" )
	htmlText = htmlText.replaceAll( /<h3>(.*)<\/h3>/g, "### $1" )
	htmlText = htmlText.replaceAll( /<h2>(.*)<\/h2>/g, "## $1" )
	htmlText = htmlText.replaceAll( /<h1>(.*)<\/h1>/g, "# $1" )
	htmlText = htmlText.replaceAll( /<strong>(.*)<\/strong>/g, "**$1**" )
	htmlText = htmlText.replaceAll( /<u>(.*)<\/u>/g, "__$1__" )
	htmlText = htmlText.replaceAll( /<em>(.*)<\/em>/g, "*$1*" )
	htmlText = htmlText.replaceAll( /<s>(.*)<\/s>/g, "~~$1~~" )
	htmlText = htmlText.replaceAll( /<p>(.*)<\/p>/g, "$1" )
	htmlText = htmlText.replaceAll( /<br>/g, "\n" )
	htmlText = htmlText.replaceAll( /<a href="(.*)">(.*)<\/a>/g, "[$2]($1)" )

	return htmlText
}