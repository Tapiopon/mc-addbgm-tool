window.onload = () => {
  if(!window.crossOriginIsolated) {
    document.getElementById("crossorigin").innerText = "お使いの端末は対応していない可能性があります";
  }
}

const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({
  log: false
});

const mcresourcefile = {
  "sounds": {
    "tapiopon_sound": {
      
    },
    "sound_definitionsfile": {
      "format_version": "1.14.0",
      "sound_definitions": {
        
      }
    }
  },
  "manifest": {
    "format_version": 2,
    "header": {
      "name": "Tapiopon Addon",
      "description": "たぴおぽん製作のアドオン",
      "version": [0, 0, 1],
      "uuid": crypto.randomUUID(),
      "min_engine_version": [1, 19, 0]
    },
    "modules": [
      {
        "type": "resources",
        "description": "res",
        "version": [0, 0, 1],
        "uuid": crypto.randomUUID()
      }
    ]
  }
}

let soundfile = false;
let filenames = [];

const sound_load = (input) => {
  soundfile = input.files[0];
  document.getElementById("file_name").innerText = input.files[0].name;
}

const add_file = async () => {
  if (!soundfile || !sound_name.value) {
    alert("エラー\nIDを記入もしくは音声ファイルをロードしてから追加してください。");
    return;
  };
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  };
  ffmpeg.setProgress(({ ratio })=>{
    ffmpegprogress.value = Math.floor(ratio*100);
    if(ratio==1) ffmpegprogress.value=0
  });
  ffmpeg.FS('writeFile', 'load.bin', await fetchFile(soundfile));
  await ffmpeg.run('-i', 'load.bin', 'edit.wav');
  await ffmpeg.run('-i', 'edit.wav', 'output.ogg');
  ffmpeg.FS('unlink', 'edit.wav');
  const data = ffmpeg.FS('readFile','output.ogg');
  ffmpeg.FS('unlink', 'output.ogg');
  filenames.push(sound_name.value);
  mcresourcefile["sounds"]["tapiopon_sound"][sound_name.value+".ogg"] = new Blob([data.buffer]);
  mcresourcefile["sounds"]["sound_definitionsfile"]["sound_definitions"][sound_name.value] = {
    "category": "music",
    "sounds": [
      {
        "load_on_low_memory": true,
        "name": "sounds/tapiopon_sound/"+sound_name.value
      }
    ]
  };
  soundfile = false;
  document.getElementById("list").innerHTML += `\<li\>${sound_name.value}\</li\>`;
}

const exportfile = () => {
  if(!resource_pack_name.value)
  mcresourcefile.manifest.header.name = resource_pack_name.value;
  mcresourcefile.manifest.header.description = resource_pack_description.value;
  const zip = new JSZip();
  for(let i=0;i<filenames.length;i++){
    zip.folder("sounds/tapiopon_sound").file(filenames[i]+".ogg",mcresourcefile["sounds"]["tapiopon_sound"][filenames[i]+".ogg"]);
  };
  zip.folder("sounds").file("sound_definitions.json", JSON.stringify(mcresourcefile["sounds"]["sound_definitionsfile"]));
  zip.file("pack_icon.png", "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAACXSURBVDiNrVO7EoAgDCucX8FjZOT/P8TREeU3cPDqAaaop5mgR0JCiyIBxrpS7/O2KnTuUmTivKSmHoOHQs3GWFd6Yo8YfCNyLp6QkYhGZLaLIhAd8TiqfnTlAOqNdeRKdIBiIECBGLzYxh4TKs5LuhCkmDpvq0LqTJCI3MphF9jJ6JE/D9J/o1yLsP2eSHTzmZAQQ/rOO3V/WWrJwh76AAAAAElFTkSuQmCC", {base64: true});
  zip.file("manifest.json", JSON.stringify(mcresourcefile["manifest"]));
  zip.generateAsync({type:"blob"}).then((blob) => {
    const a = document.createElement("a");
    a.download = `${Date.now().toString(36)}.mcpack`;
    a.href = window.URL.createObjectURL(blob);
    a.click();
  });
}

let soundfile_list = false;

const sound_load_serial_number = (input) => {
  soundfile_list = input.files;
  document.getElementById("file_name").innerText=input.files
}

const add_file_serial_number = async () => {
  if (!soundfile_list || !sound_name_serial_number.value) {
    alert("エラー\nIDを記入もしくは音声ファイルをロードしてから追加してください。");
    return;
  };
  for(let i=0;i<soundfile_list.length;i++){
    soundfile = soundfile_list[i];
    soundname_serial_number  = sound_name_serial_number.value+i
    if (!ffmpeg.isLoaded()) {
      await ffmpeg.load();
    };
    ffmpeg.setProgress(({ ratio })=>{
      ffmpegprogress.value = Math.floor(ratio*100);
      if(ratio==1) ffmpegprogress.value=0
    });
    ffmpeg.FS('writeFile', 'load.bin', await fetchFile(soundfile));
    await ffmpeg.run('-i', 'load.bin', 'edit.wav');
    await ffmpeg.run('-i', 'edit.wav', 'output.ogg');
    ffmpeg.FS('unlink', 'edit.wav');
    const data = ffmpeg.FS('readFile','output.ogg');
    ffmpeg.FS('unlink', 'output.ogg');
    filenames.push(soundname_serial_number);
    mcresourcefile["sounds"]["tapiopon_sound"][soundname_serial_number+".ogg"] = new Blob([data.buffer]);
    mcresourcefile["sounds"]["sound_definitionsfile"]["sound_definitions"][soundname_serial_number] = {
      "category": "music",
      "sounds": [
        {
          "load_on_low_memory": true,
          "name": "sounds/tapiopon_sound/"+soundname_serial_number
        }
      ]
    };
    soundfile = false;
    document.getElementById("list").innerHTML += `\<li\>${soundname_serial_number}\</li\>`;
  }
  soundfile_list = false;
}

const add_file_change_ui = () => {
  if(change_ui.value == "ui1"){
    document.getElementById("add_file_ui_1").style.display = "block";
    document.getElementById("add_file_ui_2").style.display = "none";
  }else if(change_ui.value == "ui2"){
    document.getElementById("add_file_ui_2").style.display = "block";
    document.getElementById("add_file_ui_1").style.display = "none";
  }
}