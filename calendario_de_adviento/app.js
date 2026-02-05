const hours_element = document.getElementById("hours");
const minutes_element = document.getElementById("minutes");

function actualizar_reloj() {
    const fecha = new Date();
    const hora = fecha.getHours() % 12;
    const minuto = fecha.getMinutes();
    
    if(hours_element && minutes_element) {
        hours_element.setAttribute("transform", `rotate(${(360 / 12) * hora})`);
        minutes_element.setAttribute("transform", `rotate(${(360 / 60) * minuto})`);
    }
}
setInterval(actualizar_reloj, 1000);
actualizar_reloj();

const bombilla = document.getElementById("bulb");
let luz_encendida = true;
if(bombilla){
    bombilla.addEventListener("click", () => {
        bombilla.setAttribute("fill", luz_encendida ? "transparent" : "#ffd700");
        luz_encendida = !luz_encendida;
    });
}

const cabeza = document.getElementById("head");
const brazo_1 = document.getElementById("arm_1");
const brazo_2 = document.getElementById("arm_2");
const brazo_3 = document.getElementById("arm_3");

let rotacion_brazo_1 = -25;
let rotacion_brazo_3 = 45;
let nueva_rotacion_1 = rotacion_brazo_1;
let nueva_rotacion_3 = rotacion_brazo_3;
let arrastrando = false;
let inicio_x, inicio_y;

if(cabeza){
    cabeza.addEventListener("mousedown", (e) => {
        arrastrando = true;
        inicio_x = e.clientX;
        inicio_y = e.clientY;
        e.preventDefault(); 
    });

    document.addEventListener("mousemove", (e) => {
        if (!arrastrando) return;
        const dx = e.clientX - inicio_x;
        const dy = e.clientY - inicio_y;
        nueva_rotacion_1 = Math.max(-60, Math.min(0, rotacion_brazo_1 - dy * 0.5));
        nueva_rotacion_3 = Math.max(-90, Math.min(90, rotacion_brazo_3 - dx * 0.8));
        brazo_1.setAttribute("transform", `rotate(${nueva_rotacion_1})`);
        brazo_2.setAttribute("transform", `rotate(${-nueva_rotacion_1 * 2})`);
        brazo_3.setAttribute("transform", `rotate(${nueva_rotacion_3})`);
    });

    document.addEventListener("mouseup", () => {
        if(arrastrando) {
            arrastrando = false;
            rotacion_brazo_3 = nueva_rotacion_3;
            rotacion_brazo_1 = nueva_rotacion_1;
        }
    });
}

const svg_diagrama = document.getElementById('diagrama');
const datos = [3, 4, 7, 5, 3, 6];
const namespace = "http://www.w3.org/2000/svg";

if(svg_diagrama){
    datos.forEach((dato, index) => {
        const rect = document.createElementNS(namespace, "rect");
        rect.setAttribute("x", index * 20 - 55);
        rect.setAttribute("y", 50 - dato * 10);
        rect.setAttribute("width", "15");
        rect.setAttribute("height", dato * 10);
        rect.setAttribute("fill", "#cd803d");
        svg_diagrama.appendChild(rect);
    });
    const puntos_onda = Array.from({ length: 115 }).map((_, index) => `${index - 55},${Math.sin(index / 20) * 20 + 10}`).join(" ");
    const polyline = document.createElementNS(namespace, "polyline");
    polyline.setAttribute("points", puntos_onda);
    polyline.setAttribute("fill", "none");
    polyline.setAttribute("stroke", "#000000");
    polyline.setAttribute("stroke-width", "5");
    svg_diagrama.appendChild(polyline);
}

const NS = "http://www.w3.org/2000/svg";
function crear_svg(etiqueta, atributos = {}) {
    const el = document.createElementNS(NS, etiqueta);
    for (const [clave, valor] of Object.entries(atributos)) {
        if (clave === 'style' && typeof valor === 'object') {
            Object.assign(el.style, valor);
        } else {
            el.setAttribute(clave, valor);
        }
    }
    return el;
}

function crear_copo({ x, y, grande, rapido }) {
    let nombre_clase = "snowflake";
    if (rapido) nombre_clase += " fast";
    const el = crear_svg('circle', { cx: x, cy: 0, r: grande ? 5 : 3, fill: '#ffffff', class: nombre_clase });
    el.style.setProperty('--y', y);
    return el;
}

function crear_arbol({ x, y, escala }) {
    const grupo = crear_svg('g', { transform: `translate(${x} ${y}) scale(${escala})` });
    const poligono = crear_svg('polygon', { points: "-10,0 10,0 0 -50", fill: "#38755b" });
    const tronco = crear_svg('line', { x2: "0", y2: "10", stroke: "#778074", "stroke-width": "2" });
    grupo.appendChild(poligono);
    grupo.appendChild(tronco);
    return grupo;
}

function crear_fondo() {
    const grupo = crear_svg('g');
    const cielo = crear_svg('rect', { x: "-100", y: "-100", width: "200", height: "200", fill: "#f1dbc3" });
    const suelo = crear_svg('circle', { cx: "0", cy: "380", r: "350", fill: "#f8f4e8" });
    grupo.appendChild(cielo);
    grupo.appendChild(suelo);
    return grupo;
}

function crear_contenido() {
    const grupo = crear_svg('g');
    const arboles = [{ x: -20, y: 25, escala: 1.8 }, { x: -10, y: 40, escala: 1 }, { x: 30, y: 40, escala: 0.8 }, { x: 40, y: 30, escala: 1.2 }];
    const copos = [{ x: 0, y: 0, grande: true, rapido: true }, { x: -50, y: 120, grande: true, rapido: true }, { x: -30, y: 40, grande: true, rapido: true }, { x: 50, y: 20, grande: true, rapido: true }, { x: 30, y: 150, grande: true }, { x: -70, y: 80, grande: true }, { x: 60, y: 150, grande: true }, { x: 90, y: 80, grande: true }, { x: 10, y: 50 }, { x: -50, y: 60 }, { x: -50, y: 170 }, { x: 10, y: 80 }];
    grupo.appendChild(crear_fondo());
    arboles.forEach(d => grupo.appendChild(crear_arbol(d)));
    copos.forEach(d => grupo.appendChild(crear_copo(d)));
    return grupo;
}

function montar_bola_nieve() {
    const svg = crear_svg('svg', { width: "100%", height: "100%", viewBox: "-100 -100 200 200" });
    const defs = crear_svg('defs');
    const clip_path = crear_svg('clipPath', { id: "snow_globe" });
    const circulo_clip = crear_svg('circle', { cx: 0, cy: 0, r: 80 });
    clip_path.appendChild(circulo_clip);
    defs.appendChild(clip_path);
    svg.appendChild(defs);
    const grupo_recortado = crear_svg('g', { "clip-path": "url(#snow_globe)" });
    grupo_recortado.appendChild(crear_contenido());
    svg.appendChild(grupo_recortado);
    const borde_cristal = crear_svg('circle', { r: "80", fill: "none", stroke: "gray", "stroke-width": "2" });
    svg.appendChild(borde_cristal);
    return svg;
}

const app = document.getElementById('app');
if(app){
    app.appendChild(montar_bola_nieve());
}