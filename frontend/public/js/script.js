// Wait for the HTML document to fully load before attaching events
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Setup Print Event
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 2. Setup Download Event
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadHTML();
        });
    }
});

// The download logic
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
