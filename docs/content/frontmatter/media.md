# media
`object`  
Controls the image used to identify this resource. This image will show up in the cards and whenever there’s the need to visually identify the resource. 

💡 [Unsplash](https://unsplash.com/) is a repository where great images can be found. Images are free, just make sure to reference the author (explained below).  

🧙‍♀️Consider optimizing your image by adjusting the quality and resizing it before using it.  
It is important that the images are produced with a 2:1 ratio and a size of at least **(2000x1000px)**. Images should not weigh more than **500KB**.

The [Image resizer](https://imageresizer.com/) webtool is a great resource for this task. The following video shows the process:

https://user-images.githubusercontent.com/1090606/202161004-85060cfd-0e94-426e-9385-cda73841a019.mov

Other tools that may be useful to optimize your image.

### GUI
- [ImageOptim](https://imageoptim.com/mac)
- [Compressor.io](https://compressor.io/)

### CLI
- [imagemagick](https://imagemagick.org/index.php)
- [pngquant](https://pngquant.org/)
  
This is an example one liner command that resizes `example.png` to a max width/height, drops the quality then compresses it  (using  both `imagemagick` and `pngquant`). Tweak the parameters as needed. 

`mogrify -resize "2000x1000>" -quality 70 example.png && pngquant example.png --ext .png --force`

**src**  
`string | fileSrc`  
The source for the image. Can be an absolute url like `https://example.com/img.png` or a reference to a local file. Whenever using a local file the value must be prefixed with `::file` to instruct the app how to load the file.
Example:
```yaml
media:
  src: ::file ./img-placeholder-4.jpg
```

**alt**  
`string`  
Alternative description for the image.  
Used when it is not possible to view the image, because it failed loading or when a user it using a screen reader. Should be a meaningful description.

**author**  
`object`  
Allows you to give credits to the image author by providing a `name` and an optional `url` to link to. It will normally be displayed as a info icon on top of images.
Example:
```yaml
media:
  author:
    name: Lorem Picsum
    url: https://unsplash.com/
```

![](../media/fm-media-attr.png)
