<!-- <template>
    <div class="flex justify-center items-center h-screen">
        <div
            class="flex flex-col my-20 mx-56 bg-teal-300 bg-opacity-50 h-96 border-2 border-teal-500 rounded-lg shadow-lg justify-center items-center">
            <div class="m-10 py-4">
                <h1 class="barriecito-regular text-5xl font-bold">
                    Animal Addition
                </h1>
            </div>
            <div class="flex flex-col p-4 justify-center" id="content">
                <div class="text-center pt-2 pb-1">
                    You said: {{ transcript }}
                </div>
                <div class="text-center pt-1 pb-2">
                    Result: {{ result }}
                </div>
                <div id="score" class="text-center pt-1 pb-2" ref="scoreRef">
                    Score: {{ points }}
                </div>
            </div>
        </div>
    </div>
</template> -->
<template>
    <div class="flex flex-col justify-center items-center h-screen bg-teal-100">
        <div class="flex mt-2 mb-2 w-1/2">
            <button onclick="history.back()">
                <img src="../../../assets/gameImages/buttons/arrow-back.svg"
                    class="bg-white border-2 rounded-lg border-black h-12 p-2 shadow-md hover:bg-gray-300" />
            </button>
        </div>
        <div class="flex flex-col items-center">
            <div class="m-10 py-4 text-center">
                <h1 class="barriecito-regular text-6xl font-bold">
                    Animal Addition
                </h1>
                <div class="flex flex-col p-4 justify-center" id="content">
                    <div class="pt-2 pb-1">
                        You said: {{ transcript }}
                    </div>
                    <div class="pt-1 pb-2">
                        Result: {{ result }}
                    </div>
                    <div id="score" class="pt-1 pb-2" ref="scoreRef">
                        Score: {{ points }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            answers: ["16", "27", "nine", "15", "29"],
            recognition: null,
            isRecording: false,
            audioContext: null,
            points: 0,
            audioNum: 0,
            transcript: "",
            result: "",
            currentAudios: [], // Array to store active audio objects
            recordSound: new Audio("/assets/generalAudio/ding-sound.mp3"),
        };
    },
    methods: {
        async requestMicPermission() {
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                console.log("Microphone access granted");
                this.audioContext = new (window.AudioContext ||
                    window.webkitAudioContext)();
                this.initializeSpeechRecognition();
            } catch (error) {
                console.error("Microphone access denied:", error);
            }
        },
        initializeSpeechRecognition() {
            window.SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.lang = "en-US";
            this.recognition.continuous = false;
            this.recognition.interimResults = false;

            this.recognition.onresult = async (event) => {
                const transcript = event.results[0][0].transcript;
                console.log("Transcription:", transcript);
                this.transcript = transcript;
                await this.checkAnswer(transcript, this.audioNum, this.answers);
                this.audioNum++;
                this.displayScore();

                if (this.audioNum < this.answers.length) {
                    await this.playAudio(this.audioNum);
                } else {
                    await this.endGame();
                }
            };

            this.recognition.onerror = (event) => {
                console.error("Recognition error:", event.error);
            };

            this.recognition.onend = () => {
                this.isRecording = false;
                console.log("Stopped recording");
            };
        },
        startRecording() {
            if (!this.isRecording && this.audioContext) {
                this.recognition.start();
                this.isRecording = true;
                console.log("Started recording...");
                this.recordSound.play();
            }
        },
        stopRecording() {
            if (this.isRecording) {
                this.recognition.stop();
                this.isRecording = false;
                this.recordSound.pause();
            }
        },
        async playAudio(audioNum) {
            let path = `/assets/animalAddition/animal${audioNum + 1}.mp3`;
            console.log("Playing audio path:", path);
            await this.playAudioPath(path);
            console.log("Waiting for user input...");
            await this.waitForUserInput();
        },
        playAudioPath(path) {
            return new Promise((resolve) => {
                let audio = new Audio(path);
                this.currentAudios.push(audio); // Track the audio in the array
                audio.play();

                audio.onplay = () => {
                    this.isRecording = true;
                };

                audio.onended = () => {
                    this.isRecording = false;
                    console.log("Audio ended.");
                    resolve();
                };
            });
        },
        stopAllAudios() {
            this.currentAudios.forEach((audio) => {
                audio.pause(); // Stop the audio
                audio.currentTime = 0; // Reset playback time
            });
            this.currentAudios = []; // Clear the array
        },
        waitForUserInput() {
            return new Promise((resolve) => {
                console.log("Start speech recognition for user input.");
                // this.startRecording();
                resolve();
            });
        },
        async checkAnswer(answer, audioNum, answers) {
            console.log(answers[audioNum]);
            if (answer.trim() === answers[audioNum]) {
                this.result = "Result: CORRECT";
                await this.playAudioPath(
                    "/assets/generalAudio/correctaudio.mp3"
                );
                this.points++;
            } else {
                this.result = "Result: INCORRECT";
                await this.playAudioPath(
                    "/assets/generalAudio/incorrectaudio.mp3"
                );
            }
        },
        displayScore() {
            const myScoreDiv = this.$refs.scoreRef;
            myScoreDiv.textContent = "Score: " + this.points;
        },
        async endGame() {
            const myScoreDiv = this.$refs.scoreRef;
            if (myScoreDiv) {
                myScoreDiv.textContent = `Game Over! Your Final Score: ${this.points}/5`;
            } else {
                console.error("Score ref not found in endGame.");
            }

            await this.playAudioPath("/assets/generalAudio/youGot.mp3");
            await this.playAnswer(this.points);
            await this.playAudioPath("/assets/generalAudio/outof.mp3");
            await this.playAnswer(5);
        },
        playAnswer(points) {
            return new Promise((resolve) => {
                const msg = new SpeechSynthesisUtterance();
                msg.text = points.toString();
                window.speechSynthesis.speak(msg);

                msg.onend = () => resolve();
            });
        },
        async playIntroAudio() {
            return new Promise((resolve) => {
                let audioIntro = new Audio("/assets/animalAddition/additionintro.mp3");
                this.currentAudios.push(audioIntro); // Track intro audio
                console.log("Playing intro audio now ...");
                console.log(
                    "Attempting to play intro audio from path:",
                    audioIntro.src
                );
                audioIntro.play();

                audioIntro.onended = () => {
                    console.log("Intro audio ended.");
                    resolve();
                };
            });
        },
        handleKeyDown(event) {
            if (event.key === " " && !this.isRecording) {
                this.startRecording();
            }
            if (event.shiftKey) {
                console.log("Audio button pressed!");
                this.playAudio(this.audioNum);
            }
        },
        handleKeyUp(event) {
            if (event.key === " " && this.isRecording) {
                this.stopRecording();
            }
        },
        handleBeforeUnload(event) {
            // Stop all audios and reset
            this.stopAllAudios();
            if (this.recognition) {
                this.stopRecording();
            }
        },
    },
    playDingSound() {
        this.dingAudio = new Audio("/assets/ding.mp3"); // Load the ding sound
        this.dingAudio.loop = true; // Set to loop continuously
        this.dingAudio.play(); // Play the ding sound
    },
    stopDingSound() {
        if (this.dingAudio) {
            this.dingAudio.pause(); // Stop the ding sound
            this.dingAudio.currentTime = 0; // Reset the playback time
            this.dingAudio = null; // Clear the audio object
        }
    },
    async mounted() {
        await this.requestMicPermission();
        await this.playIntroAudio();
        await this.playAudio(this.audioNum);
        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
        window.addEventListener("beforeunload", this.handleBeforeUnload);
    },
    beforeUnmount() {
        // Stop all audios and speech recognition before the component is destroyed
        this.stopAllAudios();
        if (this.recognition) {
            this.stopRecording();
        }

        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);
        window.removeEventListener("beforeunload", this.handleBeforeUnload);
    },
};
</script>
<style scoped>
/* Background color */
.bg-teal-100 {
    background-color: #faedd6;
    /* Light beige background similar to the image */
}

/* Font settings for title */
.barriecito-regular {
    font-family: "Barriecito", sans-serif;
    color: #2f2f2f;
    /* Dark text color similar to the example */
    text-align: center;
}
</style>
