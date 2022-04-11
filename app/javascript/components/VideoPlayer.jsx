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
                }
            ]
        }
        this.changeVideo = this.changeVideo.bind(this)
    }
    componentDidMount(){
        setInterval(() => {
            this.changeVideo(this.state.currentSlide)
        },5000)
    }
    changeVideo(current){
        if(current == this.state.sources.length){
            this.setState({
                currentSlide: 1,
                
            })
        }else{
            var current_slide = this.state.currentSlide
            this.setState({
                currentSlide: current_slide + 1,
                
            })
        }
    }
    render(){
        return (
            <span>
                {
                    this.state.currentSlide == 1 &&
                    <video autoPlay loop >
                        <source src="/assets/running-20bc1eb867a20718d7c9ccfbb0287683784258cc77218b0a44275c38dc9ca172.mp4" />
                    </video>
                }
                {
                    this.state.currentSlide == 2 && 
                    <video autoPlay loop >
                        <source src="/assets/medicine-8f354de8c4e758773baa0a9cba0aae86d47f3db85fe3b8b11a95a8b503132d76.mp4" />
                    </video>
                }
                {
                    this.state.currentSlide == 3 && 
                    <video autoPlay loop >
                        <source src="/assets/water-708f0de79a4e90231446ca823dfad1a6bea8cf0520c48555fa2d54adadc73e2f.mp4" />
                    </video>
                }
                
            </span>
        )
    }
}