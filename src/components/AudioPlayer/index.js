import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  FaPlay,
  FaPause,
  FaForward,
  FaBackward,
  FaVolumeUp,
} from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";

export default function AudioPlayer({
  songList,
  setSelectedSong,
  selectedSong,
  setShowSongsList,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef(new Audio(selectedSong.url));

  useEffect(() => {
    const audio = audioRef.current;

    // Pause the current song before switching
    audio.pause();

    // Set new song URL
    audio.src = selectedSong.url;
    audio.load();

    // Set volume
    audio.volume = volume;

    // Set event listeners
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleSongEnd = () => handleNext(); // When song ends, go to next song

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleSongEnd);

    // Start playing the new song only after the metadata is loaded
    const playAudio = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Audio play error:", error);
        });
    };

    audio.addEventListener("canplay", playAudio);

    return () => {
      // Cleanup listeners when song changes
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("canplay", playAudio);
      audio.removeEventListener("ended", handleSongEnd); 

      // Pause the audio to prevent overlap
      audio.pause();
    };
  }, [selectedSong]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Audio play error:", error));
    }
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handlePrev = () => {
    const prevSong =
      selectedSong.id === 1
        ? songList[songList.length - 1]
        : songList[songList.indexOf(selectedSong) - 1];
    setSelectedSong(prevSong);
  };

  const handleNext = () => {
    const nextSong =
      selectedSong.id === songList[songList.length - 1].id
        ? songList[0]
        : songList[songList.indexOf(selectedSong) + 1];
    setSelectedSong(nextSong);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // showing progress in range for audio seeker and volume
  const progressPercentage = useMemo(() => (currentTime / duration) * 100, [currentTime, duration]);
  const volumePercentage = useMemo(() => (volume / 1) * 100, [volume]);  

  // const progressPercentage = useMemo(() => {
  //   if(currentTime === duration) {
  //     handleNext()
  //   }
  //   return (currentTime / duration) * 100;
  // }, [currentTime])
  // const volumePercentage = (volume / 1) * 100;

  return (
    <div>
      {/* title and cover for song */}
      <div className="text-white text-[32px] font-[700] text-left">
        {selectedSong.name}
      </div>
      <div className="text-white/60 text-[16px]">{selectedSong.artist}</div>
      <div className="my-6">
        <img
          src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
          alt="song_cover"
          width={480}
          height={480}
          className="w-[400px] h-[400px] rounded-[8px]"
        />
      </div>

      {/* audio controls */}
      <div className="flex flex-col items-center space-y-4 text-white w-full">
        {/* audio slider and timer */}
        <div className="w-full">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="custom-range w-full"
            style={{
              background: `linear-gradient(to right, #ffffff ${progressPercentage}%, rgba(255, 255, 255, 0.2) ${progressPercentage}%)`,
            }}
          />
          <div className="flex justify-between text-sm">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        {/* aduio control buttons */}
        <div className="flex items-center justify-between space-x-4 w-full">
          {/* menu hidden & will be seen in mobile view  */}
          <div
            onClick={() => setShowSongsList(true)}
            className="md:invisible visible flex items-center bg-[#FFFFFF1A] hover:bg-[#FFFFFF30] rounded-full w-12 h-12 space-x-2 cursor-pointer"
          >
            <HiOutlineDotsHorizontal size={24} className="mx-auto" />
          </div>

          {/* play/pause/next/prev */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="opacity-60 hover:opacity-100"
            >
              <FaBackward size={24} />
            </button>
            <button
              onClick={handlePlayPause}
              className="bg-white w-12 h-12 rounded-full text-center "
            >
              {isPlaying ? (
                <FaPause color="black" size={24} className="mx-auto" />
              ) : (
                <FaPlay color="black" size={24} className="mx-auto" />
              )}
            </button>
            <button
              onClick={handleNext}
              className="opacity-60 hover:opacity-100"
            >
              <FaForward size={24} />
            </button>
          </div>

          {/* volume */}
          <div className="flex items-center space-x-2">
            <FaVolumeUp size={24} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="custom-range w-12"
              style={{
                background: `linear-gradient(to right, #ffffff ${volumePercentage}%, rgba(255, 255, 255, 0.2) ${volumePercentage}%)`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
