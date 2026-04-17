
function downloadHTML() {
    const element = document.documentElement;
    const html = element.outerHTML;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Job_Portal_Documentation.html';
    link.click();
    URL.revokeObjectURL(url);
}
