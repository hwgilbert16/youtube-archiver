# youtube-archiver
An easy and quick way to archive YouTube videos through a web interface. It's intended to be a self-hosted site for people who wish to quickly download YouTube videos without having to worry about a CLI or finding a website online.

Files downloaded from the website are saved to a user-selected directory on the host machine, where you can then access the video files.

![alt text](https://i.gyazo.com/22faa366b617cbffa9b9337c3e4d7f38.png "Image of page")

Getting Started
-----
youtube-archiver uses Docker for its simplicity. Make sure that you have it installed before installation. Links for installation are below.

- [Linux](https://docs.docker.com/linux/started/)
- [Windows](https://docs.docker.com/windows/started)
- [MacOS (OS X)](https://docs.docker.com/mac/started/)

youtube-archiver is intended to be run in a server environment, however, it should run fine on a local machine if needed.

### Installation

This application is **not** intended to be exposed to the public internet. The POST route for saving of videos does not have authentication and an individual with malice attempt could very easily fill the storage of your server.

Pull the image from Docker Hub. This may take a couple minutes.

```
docker pull hwgilbert16/youtube-archiver
```

Once the image has been downloaded, create a writeable directory to store video files in. This can be anywhere on your host machine.

Replace (directory) with the directory to store video files and (port) for which port to bind to the container's internal port.

```
docker run -d --restart=always -v (directory):/usr/src/app/videos -p (port):3000 hwgilbert16/youtube-archiver
```
If you do not wish the container to start on boot you can leave out `--restart=always`

Regardless, files in your selected video directory will persist between system reboots and reboots of the container.

An example of the run command:

```
docker run -d --restart=always -v ~/videos:/usr/src/app/videos -p 80:3000 hwgilbert16/youtube-archiver
```
The site can be accessed at the IP address of the host machine. If your selected port is not 80, make sure you specify the port in the URL.

```
1.2.3.4:1234
```

Contributing
-----

### Issues

If you discover an issue or other flaw in this repository it would be greatly appreciated if you could report it in [issues](https://github.com/hwgilbert16/youtube-archiver/issues). While there is no specific template for issues, please make sure you describe the issue in detail and verbosely.

### Pull Requests

In a pull request, please make sure you are explicitly clear in the problem you are trying to address and why the problem needs to be addressed. Make sure there are no spelling mistakes and that it reads well.

License
-----
youtube-archiver is licensed under the MIT License. See [LICENSE.md](https://github.com/hwgilbert16/youtube-archiver/blob/main/LICENSE) for more details.
