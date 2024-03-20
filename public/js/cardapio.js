document.addEventListener('DOMContentLoaded', function () {
    const groupCards = document.querySelectorAll('.group-card');
    groupCards.forEach(function (card) {
        card.addEventListener('click', function () {
            const targetGroupId = card.getAttribute('data-target');
            const targetGroup = document.getElementById(targetGroupId);
            const fixedElementHeight = document.querySelector('.fixed-container').offsetHeight;
            if (targetGroup) {
                const targetGroupOffsetTop = targetGroup.offsetTop - (fixedElementHeight + 60);
                window.scrollTo({ top: targetGroupOffsetTop, behavior: 'smooth' });
            }
        });
    });

    const buttons = document.querySelectorAll('[data-bs-toggle="collapse"]');
    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const icon = button.querySelector("i");
            if (icon.classList.contains("fa-plus")) {
                icon.classList.remove("fa-plus");
                icon.classList.add("fa-minus");
            } else {
                icon.classList.remove("fa-minus");
                icon.classList.add("fa-plus");
            }
        });
    });

    navigator.serviceWorker.register('public/service/service-worker.js')
    .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration);
    })
    .catch(error => {
        console.error('Falha ao registrar o Service Worker:', error);
    });    
});
