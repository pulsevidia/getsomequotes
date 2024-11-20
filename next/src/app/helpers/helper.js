function extractFirstLine(markdown){
	const start = markdown.indexOf("##");
	if(start == -1) return null;
	const end = markdown.indexOf('\n', start);
	if(end===-1) return null;
	const what = [markdown.slice(start +2, end).trim()];
	return what}
export {extractFirstLine}
