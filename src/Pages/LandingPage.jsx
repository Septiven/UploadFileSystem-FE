import axios from 'axios'
import React from 'react'
import {Modal, ModalBody} from 'reactstrap'
import { AddDataModal } from '../Components/AddDataModal'

class LandingPage extends React.Component{

    state = {
        data: null,
        mainImage: null,
        modalOpen: false,
        editImage: null,
        previewImage: null,
        idImage: null,
        errorMessage: ''
    }

    componentDidMount(){
        this.getData()
    }

    getData = () => {
        axios.get('http://localhost:5000/products')
        .then((res) => {
            console.log(res.data.data)
            this.setState({data: res.data.data})

            let mainImage = []
            res.data.data.forEach((value, index) => {
                mainImage.push(value.images[0])
            })
            console.log(mainImage)
            
            this.setState({mainImage: mainImage})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    onImagesValidation = (e) => {
        const file = e.target.files
        
        try {
            if(file.length > 1) throw { message: 'Select 1 Image Only' }
            if(file[0].size > 20000) throw { message: 'File Image Size More Than 20Kb' }

            this.setState({editImage: file[0], errorMessage: ''})

            const reader = new FileReader()
            reader.readAsDataURL(file[0])

            reader.onload = () => {
                if(reader.readyState === 2){
                    this.setState({previewImage: reader.result})
                }
            }
        } catch (error) {
            this.setState({errorMessage: error.message})
        }
    }

    updateImage = () => {
        try {
            if(this.state.editImage === null) throw { message: 'Select Image First' }

            let fd = new FormData()
            fd.append('images', this.state.editImage)
            console.log([...fd])

            let idImage = this.state.idImage
            
            axios.patch(`http://localhost:5000/update-image/${idImage}`, fd)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
        } catch (error) {
            this.setState({errorMessage: error.message})
        }
    }
    
    render(){
        return(
            <div>
                <div className="container px-5 py-5">
                    <div className="row">
                        <div className="col-6">
                            <h3>
                                Data Products
                            </h3>
                        </div>
                        <div className="col-6 text-right">
                            <AddDataModal />
                        </div>
                    </div>
                    <div>
                        <hr />
                    </div>
                    {/* layout Card */}
                    <div className ='row'>
                        {
                            this.state.data && this.state.mainImage?
                                this.state.data.map((value, index) => {
                                    return(
                                        <div className='col-4'>
                                            {/* Cardnya */}
                                            <div className="row card px-3 py-3" style={{width: '18rem', position: 'absolute'}}>
                                                {/* Image Card Utama */}
                                                <img src={this.state.mainImage[index].image} className="card-img-top" sytle={{width: 300, height:240}}/>
                                                <div className="row justify-content-center">
                                                    <input type="button" value="Edit Image" onClick={() => this.setState({modalOpen: true, idImage: this.state.mainImage[index].image_id})} className="btn btn-warning" style={{position: 'relative', bottom: '50px', width: '100px', opacity: 0.9}} />
                                                </div>
                                                <div className='row mt-2'>
                                                    {/* Image card yang kecil kecil */}
                                                    {
                                                        value.images.map((val, idx) => {
                                                            return(
                                                                <div className ='col-4'>
                                                                    <img src={val.image} className="card-img-top" sytle={{width: 300, height:240}} 
                                                                        onClick = {() => {
                                                                            let imageSelected = this.state.mainImage
                                                                            imageSelected[index] = val
                                                                            this.setState({mainImage: imageSelected})
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                {/* Detail Produk */}
                                                <div className="card-body">
                                                    <div className='d-flex justify-content-between'>
                                                        <h5 className="card-title">Brand</h5>
                                                        <h5 className="card-title">Rp1000000</h5>
                                                    </div>
                                                    <h6 className="card-title mt-n2">Name</h6>
                                                    <p className="card-title" style={{fontSize: 14}}>10 Stok Tersedia</p>
                                                    

                                                    
                                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                                    <a href="#" className="btn btn-primary rounded-0 w-100">Detail Product</a>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            :
                                null
                        }
                    </div>
                </div>

                <Modal toggle={() => this.setState({modalOpen: false})} isOpen={this.state.modalOpen}>
                    <ModalBody>
                        <div className="px-3">
                            <div className="row justify-content-center">
                                <div className="col-12 d-flex justify-content-center align-items-center border border-primary" style={{width: this.state.previewImage? '100%':null, height: this.state.previewImage? '100%':'100px'}}>
                                    
                                    {
                                        this.state.previewImage?
                                            <img src={this.state.previewImage} alt='Image Preview' width='50%' />
                                        :
                                            <h6>
                                                Image Preview
                                            </h6>
                                    }
                                </div>
                                <div className="col-6 mt-3">
                                    <div>
                                        <input type="file" ref={e => this.files = e} accept="image/*" onChange={this.onImagesValidation} style={{display: 'none'}} />
                                        <input type="button" value="Choose File" onClick={() => this.files.click()} className="btn btn-warning" />
                                    </div>
                                </div>
                                <div className="col-6 mt-3">
                                    No File Chosen
                                </div>
                                <div className="col-12">
                                    {this.state.errorMessage}
                                </div>
                                <div className="col-12 mt-3">
                                    <input type="button" value="Submit" onClick={this.updateImage} className="btn btn-primary w-100" />
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

export default LandingPage