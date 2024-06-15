document.addEventListener("DOMContentLoaded", function() {
    let isSelectingLanding = false;
    let isSelectingThrowing = false;
    let selectedMap = "anubis";

    const mapSelect = document.getElementById('map');
    const mapImage = document.getElementById('map-image');
    const mapContainer = document.getElementById('map-container');

    mapSelect.addEventListener('change', function() {
        selectedMap = mapSelect.value;
        mapImage.src = `../img/${selectedMap}-map.jpg`;
        loadExistingGrenades(selectedMap);
    });

    document.getElementById('select-landing').addEventListener('click', function() {
        isSelectingLanding = true;
        isSelectingThrowing = false;
    });

    document.getElementById('select-throwing').addEventListener('click', function() {
        isSelectingLanding = false;
        isSelectingThrowing = true;
    });

    mapImage.addEventListener('click', function(event) {
        const rect = event.target.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100; // Coordenada X relativa à imagem (em %)
        const y = ((event.clientY - rect.top) / rect.height) * 100;  // Coordenada Y relativa à imagem (em %)

        if (isSelectingLanding) {
            document.getElementById('landing-position').value = `${x}, ${y}`;
            isSelectingLanding = false;
        } else if (isSelectingThrowing) {
            document.getElementById('throwing-position').value = `${x}, ${y}`;
            isSelectingThrowing = false;
        }
    });

    document.getElementById('submit-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const map = document.getElementById('map').value;
        const type = document.getElementById('type').value;
        const video = document.getElementById('video').value;
        const landingPosition = document.getElementById('landing-position').value;
        const throwingPosition = document.getElementById('throwing-position').value;

        const grenade = {
            map,
            type,
            video,
            landingPosition,
            throwingPosition
        };

        let grenades = JSON.parse(localStorage.getItem('grenades')) || [];
        grenades.push(grenade);
        localStorage.setItem('grenades', JSON.stringify(grenades));

        alert('Grenade submitted successfully!');
        document.getElementById('submit-form').reset();
        loadExistingGrenades(map); // Atualiza as granadas exibidas
    });

    function loadExistingGrenades(map) {
        const grenades = JSON.parse(localStorage.getItem('grenades')) || [];
        mapContainer.innerHTML = `<img src="../img/${map}-map.jpg" alt="Map" id="map-image" style="width: 85%; max-width: 850px;">`;

        const mapImage = document.getElementById('map-image');

        grenades.forEach((grenade, index) => {
            if (grenade.map === map) {
                const [x, y] = grenade.landingPosition.split(',').map(Number);
                const iconPath = `../img/icons/${grenade.type}.png`;

                const marker = document.createElement('img');
                marker.src = iconPath;
                marker.classList.add('icon-submit'); // Aplicando a classe correta
                marker.style.left = `${x}%`;
                marker.style.top = `${y}%`;
                mapContainer.appendChild(marker);

                marker.addEventListener('click', () => {
                    const confirmDelete = confirm('Do you want to delete this grenade?');
                    if (confirmDelete) {
                        grenades.splice(index, 1);
                        localStorage.setItem('grenades', JSON.stringify(grenades));
                        loadExistingGrenades(map);
                    }
                });
            }
        });

        // Re-bind the click event for the new map-image element
        mapImage.addEventListener('click', function(event) {
            const rect = event.target.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100; // Coordenada X relativa à imagem (em %)
            const y = ((event.clientY - rect.top) / rect.height) * 100;  // Coordenada Y relativa à imagem (em %)

            if (isSelectingLanding) {
                document.getElementById('landing-position').value = `${x}, ${y}`;
                isSelectingLanding = false;
            } else if (isSelectingThrowing) {
                document.getElementById('throwing-position').value = `${x}, ${y}`;
                isSelectingThrowing = false;
            }
        });
    }

    // Inicialização
    loadExistingGrenades(selectedMap);
});
