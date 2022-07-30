import React from 'react';

export default class VideoPlayer extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            currentSlide: 1,
            
            sources: [
                {
                    id: 1,
                    source: "/assets/running-20bc1eb867a20718d7c9ccfbb0287683784258cc77218b0a44275c38dc9ca172.mp4"
                },
                {
                    id: 2,
                    source: "/assets/medicine-8f354de8c4e758773baa0a9cba0aae86d47f3db85fe3b8b11a95a8b503132d76.mp4",
                },
                {
                    id: 3,
                    source: "/assets/water-708f0de79a4e90231446ca823dfad1a6bea8cf0520c48555fa2d54adadc73e2f.mp4"
                },
                {
                    id: 4,
                    source: "/assets/posture_check_video_v2.mp4"
                }
            ]
        }
        this.changeVideo = this.changeVideo.bind(this)
    }
    componentDidMount(){
        
    }
    changeVideo(current){
     
    }
    render(){
        return (
             <span>
                <video autoPlay loop muted id="main-video">
                    <source src="/assets/posture_check_video_v3.mp4" type="video/mp4" />
                </video>
            </span>
        )
    }
}