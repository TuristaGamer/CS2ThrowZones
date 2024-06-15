function filterNades(type) {
    // Limpar ícones, contadores e linhas existentes
    const icons = document.querySelectorAll('.icon, .throw-icon');
    const counts = document.querySelectorAll('.count-icon');
    const lines = document.querySelectorAll('line');
    icons.forEach(icon => icon.remove());
    counts.forEach(count => count.remove());
    lines.forEach(line => line.remove());

    // Filtrar granadas conforme a parte do mapa (upper/lower) se necessário
    const mapPart = (mapName === 'nuke' || mapName === 'vertigo') ? currentMapPart : 'map';
    const grenades = window.grenades[type] || [];
    const landingPositions = {};

    grenades.forEach(grenade => {
        if (mapPart === 'map' || grenade.mapPart === mapPart) {
            const landingPosKey = grenade.landingPosition;

            if (!landingPositions[landingPosKey]) {
                landingPositions[landingPosKey] = [];
            }

            landingPositions[landingPosKey].push(grenade);
        }
    });

    // Adicionar ícones e contadores ao mapa
    Object.keys(landingPositions).forEach(landingPosKey => {
        const [x, y] = landingPosKey.split(',').map(Number);

        const icon = document.createElement('img');
        icon.src = `/img/icons/${type}.png`;
        icon.classList.add('icon', 'grenade-icon');
        icon.style.position = 'absolute';
        icon.style.left = `${x}%`;
        icon.style.top = `${y}%`;
        document.querySelector('#icons-container').appendChild(icon);

        const count = landingPositions[landingPosKey].length;
        if (count > 1) {
            const countElement = document.createElement('div');
            countElement.classList.add('count-icon');
            countElement.textContent = count;
            countElement.style.position = 'absolute';
            countElement.style.left = `${x}%`;
            countElement.style.top = `${y}%`;
            document.querySelector('#icons-container').appendChild(countElement);
        }

        // Mostrar imagem quando o mouse estiver sobre o ícone
        icon.addEventListener('mouseover', () => {
            const grenade = landingPositions[landingPosKey][0];
            const imagePreview = document.getElementById('image-preview');
            imagePreview.src = grenade.imageUrl;

            const iconRect = icon.getBoundingClientRect();
            const previewHeight = 150;
            const containerRect = document.querySelector('.map-container').getBoundingClientRect();

            if (iconRect.top - previewHeight < containerRect.top) {
                imagePreview.style.top = `${y + 23}%`;
            } else {
                imagePreview.style.top = `${y - 5}%`;
            }

            imagePreview.style.left = `${x}%`;
            imagePreview.style.transform = 'translate(-50%, -100%)';
            imagePreview.style.display = 'block';
        });

        icon.addEventListener('mouseout', () => {
            const imagePreview = document.getElementById('image-preview');
            imagePreview.style.display = 'none';
        });

        icon.addEventListener('click', () => {
            const grenadesAtLandingPos = landingPositions[landingPosKey];

            document.querySelectorAll('.icon, .count-icon').forEach(el => {
                el.style.display = 'none';
            });

            const throwIcons = document.querySelectorAll('.throw-icon');
            throwIcons.forEach(throwIcon => throwIcon.remove());
            const lines = document.querySelectorAll('#lines-container line');
            lines.forEach(line => line.remove());

            grenadesAtLandingPos.forEach(grenade => {
                const throwIcon = document.createElement('img');
                throwIcon.src = '/img/icons/throwing.png';
                throwIcon.classList.add('throw-icon');

                const [tx, ty] = grenade.throwingPosition.split(',').map(Number);

                // Ajustar coordenadas se for o mapa Nuke
                const adjustedTx = (mapName === 'nuke') ? tx * 1.5 : tx;
                const adjustedTy = (mapName === 'nuke') ? ty * 1.5 : ty;
                const adjustedX = (mapName === 'nuke') ? x * 1.5 : x;
                const adjustedY = (mapName === 'nuke') ? y * 1.5 : y;

                throwIcon.style.position = 'absolute';
                throwIcon.style.left = `${adjustedTx}%`;
                throwIcon.style.top = `${adjustedTy}%`;
                document.querySelector('#icons-container').appendChild(throwIcon);

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', `${adjustedTx}%`);
                line.setAttribute('y1', `${adjustedTy}%`);
                line.setAttribute('x2', `${adjustedX}%`);
                line.setAttribute('y2', `${adjustedY}%`);
                line.setAttribute('stroke', 'green');
                line.setAttribute('stroke-width', '2.4');
                line.setAttribute('stroke-dasharray', '5,5');
                document.querySelector('#lines-container').appendChild(line);

                throwIcon.addEventListener('mouseover', () => {
                    const videoPreview = document.createElement('iframe');
                    videoPreview.src = `https://www.youtube.com/embed/${extractYouTubeID(grenade.video)}?autoplay=1&mute=1`;
                    videoPreview.allow = "autoplay";

                    const throwIconRect = throwIcon.getBoundingClientRect();
                    const videoPreviewHeight = 200;
                    const containerRect = document.querySelector('.map-container').getBoundingClientRect();

                    if (throwIconRect.top - videoPreviewHeight < containerRect.top) {
                        videoPreview.style.top = `${adjustedTy + 27}%`;
                    } else {
                        videoPreview.style.top = `${adjustedTy - 2}%`;
                    }

                    videoPreview.style.left = `${adjustedTx}%`;
                    videoPreview.style.transform = 'translate(-50%, -100%)';
                    videoPreview.style.width = '300px';
                    videoPreview.style.height = '200px';
                    videoPreview.style.zIndex = '5';
                    videoPreview.classList.add('video-preview');
                    document.querySelector('#icons-container').appendChild(videoPreview);

                    throwIcon.addEventListener('mouseout', () => {
                        videoPreview.remove();
                    });
                });

                throwIcon.addEventListener('click', () => {
                    window.location.href = `/grenades/${mapName}/${type}/${grenade.id}`;
                });
            });

            icon.style.display = 'block';
        });
    });

    const menuItems = document.querySelectorAll('.sidebar ul li');
    menuItems.forEach(item => {
        item.classList.remove('selected');
    });
    document.getElementById(type).classList.add('selected');
}

document.addEventListener('DOMContentLoaded', () => {
    filterNades('smoke');
});

document.getElementById('map-image').addEventListener('click', (event) => {
    if (event.target.id === 'map-image') {
        document.querySelectorAll('.icon, .count-icon').forEach(el => {
            el.style.display = 'block';
        });

        document.querySelectorAll('.throw-icon').forEach(throwIcon => {
            throwIcon.remove();
        });
        document.querySelectorAll('#lines-container line').forEach(line => {
            line.remove();
        });
    }
});

function extractYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : null;
}
