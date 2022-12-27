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
let sharedfile_data;
let soundfile_list = false;
let mcpack_list = false;

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
  document.getElementById("list").innerHTML += `\<li onclick="play_sound('${window.URL.createObjectURL(new Blob([data.buffer]))}')"\>${sound_name.value}\</li\>`;
  document.getElementById("file_name").innerText = "";
}

const exportfile = () => {
  if(!resource_pack_name.value) {
    alert("エラー")
    return;
  };
  mcresourcefile.manifest.header.name = resource_pack_name.value;
  mcresourcefile.manifest.header.description = resource_pack_description.value;
  const zip = new JSZip();
  for(let i=0;i<filenames.length;i++){
    zip.folder("sounds/tapiopon_sound").file(filenames[i]+".ogg",mcresourcefile["sounds"]["tapiopon_sound"][filenames[i]+".ogg"]);
  };
  zip.folder("sounds").file("sound_definitions.json", JSON.stringify(mcresourcefile["sounds"]["sound_definitionsfile"]));
  zip.file("pack_icon.png", "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAACXSURBVDiNrVO7EoAgDCucX8FjZOT/P8TREeU3cPDqAaaop5mgR0JCiyIBxrpS7/O2KnTuUmTivKSmHoOHQs3GWFd6Yo8YfCNyLp6QkYhGZLaLIhAd8TiqfnTlAOqNdeRKdIBiIECBGLzYxh4TKs5LuhCkmDpvq0LqTJCI3MphF9jJ6JE/D9J/o1yLsP2eSHTzmZAQQ/rOO3V/WWrJwh76AAAAAElFTkSuQmCC", {base64: true});
  zip.file("manifest.json", JSON.stringify(mcresourcefile["manifest"]));
  zip.generateAsync({
    type:"blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9
    }
  }).then((blob) => {
    const a = document.createElement("a");
    a.download = `${resource_pack_name.value}.mcpack`;
    a.href = window.URL.createObjectURL(blob);
    a.click();
  });
}

const sound_load_serial_number = (input) => {
  soundfile_list = input.files;
  for(let i=0;i<soundfile_list.length;i++){
    document.getElementById("file_name_ui2").innerText += soundfile_list[i].name+"\n";
  }
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
    document.getElementById("list").innerHTML += `\<li onclick="play_sound('${window.URL.createObjectURL(new Blob([data.buffer]))}')"\>${soundname_serial_number}\</li\>`;
  }
  soundfile_list = false;
  document.getElementById("file_name_ui2").innerText = "";
}

const mcpack_load = (input) => {
  mcpack_list = input.files;
  for(let i=0;i<mcpack_list.length;i++){
    document.getElementById("file_name_ui3").innerText += mcpack_list[i].name+"\n";
  }
}

const mcpack_join = () => {
  console.log("join")
  const zip = new JSZip();
  for(let i=0;i<mcpack_list.length;i++){
    const reader = new FileReader();
    reader.onload = (inport) => {
      zip.loadAsync(inport.target.result).then(async()=>{
        zip.file("sounds/sound_definitions.json")
        .async("text")
        .then((data)=>{
          let jsondata = JSON.parse(data);
          if(Object.keys(jsondata["sound_definitions"]).length !== 0) {
            for(let n=0;n<Object.keys(jsondata["sound_definitions"]).length;n++){
              filename_bool = true;
              for(let x=0;x<filenames.length;x++){
                if(Object.keys(jsondata["sound_definitions"])[n] == filenames[x]){
                  filename_bool = false
                }
              }
              if(filename_bool){
                filenames.push(Object.keys(jsondata["sound_definitions"])[n]);
                zip.file("sounds/tapiopon_sound/"+Object.keys(jsondata["sound_definitions"])[n]+".ogg")
                .async("blob")
                .then((blob_data)=>{
                  mcresourcefile["sounds"]["tapiopon_sound"][Object.keys(jsondata["sound_definitions"])[n]+".ogg"] = blob_data;
                  mcresourcefile["sounds"]["sound_definitionsfile"]["sound_definitions"][Object.keys(jsondata["sound_definitions"])[n]] = {
                    "category": "music",
                    "sounds": [
                      {
                        "load_on_low_memory": true,
                        "name": "sounds/tapiopon_sound/"+Object.keys(jsondata["sound_definitions"])[n]
                      }
                    ]
                  };
                  document.getElementById("list").innerHTML += `\<li onclick="play_sound('${window.URL.createObjectURL(blob_data)}')"\>${Object.keys(jsondata["sound_definitions"])[n]}\</li\>`;
                })
              }
            }
          }
        });
      });
    };
    reader.readAsArrayBuffer(mcpack_list[i])
  }
}


const add_file_change_ui = () => {
  if(change_ui.value == "ui1"){
    document.getElementById("add_file_ui_1").style.display = "block";
    document.getElementById("add_file_ui_2").style.display = "none";
    document.getElementById("join_file_ui_1").style.display = "none";
  }else if(change_ui.value == "ui2"){
    document.getElementById("add_file_ui_2").style.display = "block";
    document.getElementById("add_file_ui_1").style.display = "none";
    document.getElementById("join_file_ui_1").style.display = "none";
  }else if(change_ui.value == "ui3"){
    document.getElementById("add_file_ui_1").style.display = "none";
    document.getElementById("add_file_ui_2").style.display = "none";
    document.getElementById("join_file_ui_1").style.display = "block";
  }
}

let aud = new Audio();

const play_sound = (data) => {
  aud.pause();
  aud = new Audio(data);
  aud.play();
}