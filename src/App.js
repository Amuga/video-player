import React, { useState, useEffect, useRef } from 'react';
import { mediaJSON } from './testData'
import  playSvg  from './assets/play.svg'
import  pauseSvg  from './assets/pause.svg'
import forwardSvg from './assets/forward.svg'
import backwardSvg from './assets/backward.svg'
import nextSvg from './assets/next.svg'
import previousSvg from './assets/previous.svg'
import './App.css';

function App() {
  const [playlist, setPlaylist] = useState(mediaJSON.categories[0].videos)
  const [currentMedia, setCurrentMedia] = useState(0) // Index of currently played media
  const [isPlaying, setIsPlaying] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const videoRef = useRef()

  const loadMedia = () => {
    const loadedMedia = playlist[currentMedia].sources[0];
    videoRef.current.src = loadedMedia
    videoRef.current.load()
  }

  useEffect(() => {
    loadMedia()
  }, [currentMedia])


  const handleAddMedia = () => {
    const newMedia = {
      description: urlInput,
      sources: [urlInput],
      subtitle: "",
      thumb: "",
      title: urlInput,
    };
    setPlaylist([...playlist, newMedia])
    setUrlInput('')
  }
  
  const handleRemoveMedia = (index) => {
    const updatedPlaylist = playlist.filter((_, i) => i !== index)
    setPlaylist(updatedPlaylist)
    /* known bug with removing the first video (if it's the one being played) and the player not updating
      probably related with updating the index state to the same value (0 to 0) not triggering an update */
    setCurrentMedia( index === currentMedia ? 0 : currentMedia)
  }
  
  const handlePlayPause = () => {
    
    if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true) 
    } else {
        videoRef.current.pause()
        setIsPlaying(false) 
    }
  }

  const handleFastBackward = () => {
    videoRef.current.currentTime -= 10
  }

  const handleFastForward = () => {
    videoRef.current.currentTime += 10
  }

  const handlePreviousMedia = () => {
    setIsPlaying(false)
    if (currentMedia === 0) {
      setCurrentMedia(playlist.length - 1)
    } else {
      setCurrentMedia(currentMedia - 1)
    }
  }
  
  const handleNextMedia = () => {
    setIsPlaying(false)
    if (currentMedia === playlist.length - 1) {
      setCurrentMedia(0);
    } else {
      setCurrentMedia(currentMedia + 1)
    }
  }

  const handleInputChange = e => {
    setUrlInput(e.target.value)
  }
  
  return (
    <div className='App'>
      <h2>Playlist</h2>
      <ul>
        {playlist.map((media, index) => (
          <li
            key={index}
            style={{ fontWeight: index === currentMedia ? 'bold' : 'normal' }}
          >
            {media.title}
            <button onClick={() => handleRemoveMedia(index)}>Remove</button>
          </li>
        ))}
      </ul>
      
      <h2>Add Media</h2>
      <input type="text" id="mediaUrl" onChange={handleInputChange} placeholder='Enter URL' value={urlInput}/>
      <button onClick={handleAddMedia}>
        Add
      </button>
      <div>
        <video id="video" ref={videoRef}  onClick={handlePlayPause}/>
      </div>
      <button onClick={handlePreviousMedia}>
        <img src={previousSvg} alt='Previous Media'/>
      </button>
      <button onClick={handleFastBackward}>
        <img src={backwardSvg}  alt='Fast Backward'/>
      </button>
      <button onClick={handlePlayPause}>
        <img
            src={isPlaying ? pauseSvg : playSvg}
            alt={isPlaying ? 'Pause' : 'Play'}
          />
      </button>
      <button onClick={handleFastForward}>
        <img src={forwardSvg} alt='Fast Forward'/>
      </button>
      <button onClick={handleNextMedia}>
        <img src={nextSvg} alt='Next Media'/>
      </button>

    </div>
  )
}

export default App