const sounds = [ "./media/clap.wav", "./media/hihat.wav", "./media/openhat.wav", "./media/snare.wav"];
const drumkit = document.createElement("div");
drumkit.classList.add("drumkit");

for (let i = 0; i < sounds.length; i++) {
    const src = sounds[i];
    AddSound(src);
}
document.body.append(drumkit);

document.addEventListener('keypress', onKeyPress);


const tracks = document.createElement("div");
tracks.classList.add("tracks");
const RECORD_CHANNELS = 4;
let track_list = [];

for (let i = 0; i < RECORD_CHANNELS; i++) {
    const channel = document.createElement("div");
    channel.setAttribute("id", `channel${i}`);
    const text = document.createElement("span");
    text.innerText = `TRACK ${i}`;
    channel.append(text);

    const record = document.createElement("button");
    record.innerText = "Record";
    record.addEventListener("click", RecordTrack);
    channel.append(record);

    const play = document.createElement("button");
    play.innerText = "Play";
    play.addEventListener("click", PlayTrack);
    channel.append(play);

    tracks.append(channel);
}

document.body.append(tracks);

InitiateMetronome();

function InitiateMetronome() {
    const metronome = document.createElement('div');
    const audio = document.createElement('audio');
    audio.src='./media/metronome.mp3';
    audio.controls = true;
    audio.hidden = true;
    const label_metronome = document.createElement('label');

    metronome.id = 'metronome';
    label_metronome.innerText = 'Metronome';

    const enable_metronome = document.createElement('input');
    enable_metronome.type = 'checkbox';

    const bpm = document.createElement("input");

    bpm.id = 'bpm';
    bpm.type = 'number';
    bpm.min = 1;
    bpm.max = 600;
    bpm.defaultValue = 120;

    label_metronome.append(enable_metronome);
    metronome.append(audio, label_metronome, bpm);
    document.body.append(metronome);

    let interval;
    let isPlaying = false;
    let currentBpm = 60_000 / bpm.value;
    
    bpm.addEventListener('change', () => {
        UpdateInterval();
    });
    enable_metronome.addEventListener('change', () => {
        PlayMetronome()
    });

    function UpdateInterval() {
        currentBpm = 60_000 / bpm.value;
        if (isPlaying) {
            clearInterval(interval);
            interval = setInterval(() => {
                playSound(audio);
            }, currentBpm);
        }
    }

    function PlayMetronome() {
        if (enable_metronome.checked == true) {
            interval = setInterval(() => {
                playSound(audio);
            }, currentBpm);
            isPlaying = true;
        } else {
            clearInterval(interval);
            isPlaying = false;
        }
    }
}

function RecordTrack(event) {
    const trackId = Number(event.target.parentElement.getAttribute("id").replace("channel", ""));
    let track = [0];
    const startTime = Date.now();
    let recordBtn = event.target;
    document.addEventListener("keypress", Record)
    recordBtn.removeEventListener("click", RecordTrack);
    recordBtn.innerText = "Stop recording";
    recordBtn.addEventListener("click", () => {
        track.push(Date.now() - startTime);
        const newBtn = recordBtn.cloneNode(true);
        recordBtn.replaceWith(newBtn);
        recordBtn = newBtn;
        recordBtn.innerText = "Record";
        document.removeEventListener("keypress", Record);
        recordBtn.addEventListener("click", RecordTrack);
        track_list[trackId] = track;
        console.log(track_list);
    });

    function Record(event) {
        track.push({
            timestamp: Date.now() - startTime,
            key: event.key
        });
    }
}

async function PlayTrack(event) {
    const trackId = Number(event.target.parentElement.getAttribute("id").replace("channel", ""));

    const track = track_list[trackId];
    let trackBtn = event.target;
    let trackPlaying = true;

    if (trackId == 0) {
        ToggleTracks();
    }

    await Play(track);
    trackBtn.innerText = "Stop playing";
    trackBtn.removeEventListener("click", PlayTrack);

    trackBtn.addEventListener("click", () => {
        trackPlaying = false;
        const newBtn = trackBtn.cloneNode(true);
        trackBtn.replaceWith(newBtn);
        trackBtn = newBtn;
        trackBtn.innerText = "Play";
        trackBtn.addEventListener("click", PlayTrack);
        trackPlaying = false;
        if (trackId == 0) {
            ToggleTracks();
        }
    });

    async function Play(track) {
        let trackDuration = track[track.length-1];
        for (let i = 0; i < track.length; i++) {
            const sound = track[i];
            setTimeout(() => {
                if (sound.key != null && trackPlaying) playSound(KeyToSound[sound.key]);
            }, sound.timestamp);
        }
        setTimeout(() => {
            if (trackPlaying) Play(track);
        }, trackDuration);
    }

    function ToggleTracks() {
        targetTracks = [1, 3];
        for (let i = 0; i < targetTracks.length; i++) {
            const id = targetTracks[i];
            const target = document.getElementById(`channel${id}`);
            target.querySelectorAll('button').forEach((btn) => btn.disabled = !btn.disabled);
        }
    }
}

const KeyToSound = 
{
    'a': drumkit.children[0],
    's': drumkit.children[1],
    'd': drumkit.children[2],
    'f': drumkit.children[3]
}

function onKeyPress(event) {
    const sound = KeyToSound[event.key];
    playSound(sound);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function AddSound(src) {
    const sound = document.createElement("audio");
    sound.setAttribute("src", src);
    sound.setAttribute("controls", "");
    drumkit.append(sound);
}