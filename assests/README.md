# Media Sources

This project uses remote royalty-free visual media so it can deploy to GitHub Pages without a build pipeline or large binary files.

## License References

- Pixabay content license summary: https://pixabay.com/service/license-summary/
- Pexels license: https://www.pexels.com/license/
- Unsplash license: https://unsplash.com/license

Both services allow free use of media, including modification. Review the current license pages before commercial launch, especially where recognizable trademarks, properties, vehicles, or people appear.

## Video Sources

- Luxury car hero and automotive closeups: Pixabay luxury car videos - https://pixabay.com/videos/search/luxury%20car/
- Toronto city footage: Pixabay Toronto skyline videos - https://pixabay.com/videos/search/toronto%20skyline/
- Direct CDN video files are used in `index.html` because the Pixabay CDN supports browser range requests for streaming.

## Photo Sources

- Ferrari, Mercedes G-Wagon, Rolls Royce, workspace, gym, and mansion imagery are loaded from Unsplash image CDN URLs.
- Lamborghini, Nissan GTR, McLaren, and the final garage scene are loaded from Pexels image CDN URLs.
- Relevant Unsplash search/source pages:
  - Ferrari: https://unsplash.com/s/photos/ferrari-car
  - Mercedes G-Wagon: https://unsplash.com/s/photos/g-wagon
  - Rolls Royce: https://unsplash.com/s/photos/rolls-royce
  - Toronto night: https://unsplash.com/s/photos/toronto-night
  - Toronto skyline: https://unsplash.com/s/photos/toronto-skyline
- Relevant Pexels search/source pages:
  - Lamborghini: https://www.pexels.com/search/lamborghini/
  - Nissan GTR: https://www.pexels.com/search/nissan%20gtr/
  - McLaren: https://www.pexels.com/search/mclaren/

## Replacement Notes

For production ownership, download the chosen media, optimize it with a tool such as Squoosh or HandBrake, and replace remote URLs with local files under `assets/images/` and `assets/videos/`. Keep videos around 8-15 seconds, compressed to H.264 MP4, and provide poster images for every video.
