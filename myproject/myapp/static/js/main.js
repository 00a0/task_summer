document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => 
                b.classList.remove('active'));
            
            document.querySelectorAll('.page-content').forEach(page => 
                page.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`page-${btn.dataset.page}`)
                .classList.add('active');
        });
    });
});