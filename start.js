<!DOCTYPE html>
<html lang="en">

<head>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    canvas {
      border: 2px solid black;
      display: block;
      margin: 20px auto;
    }
  </style>
  <title>Canvas Demo</title>
</head>

<body>
  <canvas id="myCanvas" width="1000" height="200"></canvas>

  <script>
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");

    const textStages = [
    {
        main: "En lo más profundo de la selva, donde los rayos del sol apenas logran penetrar, se encuentra Eva Seeker, una intrépida exploradora estadounidense con un anhelo ardiente: hallar un tesoro perdido en las sombras.",
        sub: "Presiona [ESPACIO] para continuar."
    },
    {
        main: "Guiada por la leyenda de un artefacto legendario, Eva se adentra aún más en la espesura. Susurros de hojas y misteriosos sonidos llenan el aire mientras sigue las huellas de su amigo, quien le reveló la existencia de algo asombroso.",
        sub: "Presiona [ESPACIO] para continuar."
    },
    {
        main: "Bajo el dosel verde, Eva tropieza con un descubrimiento inesperado: un diario antiguo yace en el suelo, oculto entre las hojas. Las páginas amarillentas parecen contener secretos ancestrales. La curiosidad enciende su corazón aventurero.",
        sub: "Presiona [ESPACIO] para continuar."
    },
    {
        main: "Con manos temblorosas, Eva abre el diario y se sumerge en relatos olvidados. Entre las líneas, descubre pistas crípticas que conducen a un tesoro oculto. Sin embargo, una barrera se interpone: una caja fuerte impenetrable que requiere un código.",
        sub: "Presiona [ESPACIO] para continuar."
    },
    {
        main: "La emoción embarga a Eva Seeker. ¡Ahora depende de ti ayudarla a resolver este enigma! Adéntrate en la selva, descifra el código y desentraña el misterio que aguarda en las profundidades de la jungla.",
        sub: "Presiona [ESPACIO] para continuar."
    }
];


    let currentStageIndex = 0;
    let boxVisible = true;

    const image = new Image();
    image.src = "https://media.istockphoto.com/id/920143058/photo/aged-paper-texture.jpg?s=612x612&w=0&k=20&c=SNanEc4wOU6eqt7gzXmN5PM-PuyMlKh_Q48fhYk71Xo=";

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
      let words = text.split(' ');
      let line = '';

      for (let i = 0; i < words.length; i++) {
        let testLine = line + words[i] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;

        if (testWidth > maxWidth && i > 0) {
          context.fillText(line, x, y);
          line = words[i] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }

      context.fillText(line, x, y);
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (boxVisible && currentStageIndex < textStages.length) {
        ctx.drawImage(image, 0, 0, 500, 200);

        if (currentStageIndex < textStages.length - 1) {
          ctx.strokeStyle = "black";
          ctx.strokeRect(0, 0, 500, 200);
        }

        ctx.font = "20px Comic Sans";
        ctx.fillStyle = "black";
        wrapText(ctx, textStages[currentStageIndex].main, 20, 40, 500 - 40, 20);
        ctx.font = "14px Arial";
        ctx.fillText(textStages[currentStageIndex].sub, 20, 170);
      }
    }

    function handleKeyPress(event) {
      if (event.code === "Space") {
        if (currentStageIndex < textStages.length - 1) {
          currentStageIndex++;
        } else {
          boxVisible = false;
        }

        draw();
      }
    }

    draw();

    window.addEventListener("keydown", handleKeyPress);
  </script>
</body>

</html>
