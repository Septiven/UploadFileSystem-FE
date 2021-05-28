import axios from 'axios'
import React, { Component } from 'react'
import {Modal, ModalBody} from 'reactstrap'

export class AddDataModal extends Component{

    state = {
        modalOpen: false,
        images: null,
        totalFile: null,
        imagesErrorMessage: ''
    }

    onImagesValidation = (e) => {
        const files = e.target.files
        console.log(files)
        try {
           if(files.length > 3) throw { message: 'Select 3 Images Only!' }

           for(let i = 0; i < files.length; i++){
               if(files[i].size > 20000) throw { message: `${files[i].name} More Than 50Kb` }
           }

           this.setState({images: files, imagesErrorMessage: '', totalFile: files.length})
        } catch (error) {
            this.setState({imagesErrorMessage: error.message})
        }
    }

    onSubmitData = () => {
        console.log(this.state.images)
        let name = this.name.value
        let brand = this.brand.value
        let price = this.price.value
        let stock = this.stock.value

        try {
            if(!name || !brand || !price || !stock) throw { message: 'Data Must Be Filled' }
            if(!this.state.images) throw { message: 'Select Images First!' }

            let data = {
                name,
                brand,
                price,
                stock
            }

            let dataToSend = JSON.stringify(data)
            console.log(dataToSend)

            let fd = new FormData()
            fd.append('data', dataToSend)
            
            console.log(this.state.images[0])

            for(let i = 0; i < this.state.images.length; i++){
                fd.append('image', this.state.images[i])
            }
            
            console.log([...fd])
            axios.post('http://localhost:5000/upload-product', fd)
            .then((res) => {
                alert('Add Data Success!')
                this.setState({modalOpen: false})
            })
            .catch((err) => {
                console.log(err)
            })
        } catch (error) {
            this.setState({imagesErrorMessage: error.message})
        }
    }

    render(){
        return(
            <>
                <input type="button" value="Add Data" onClick={() => this.setState({modalOpen: true})} className="btn btn-dark" />
                <Modal toggle={() => this.setState({modalOpen: false})} isOpen={this.state.modalOpen}>
                    <ModalBody>
                        <div className="text-center">
                            <h3>
                                Add Data Product
                            </h3>
                        </div>
                        <div className="pb-3">
                            <h6>Product Name :</h6>
                            <input type="text" ref={(e) => this.name = e} className="form-control" />
                        </div>
                        <div className="pb-3">
                            <h6>Brand Name :</h6>
                            <input type="text" ref={(e) => this.brand = e} className="form-control" />
                        </div>
                        <div className="pb-3">
                            <h6>Price :</h6>
                            <input type="text" ref={(e) => this.price = e} className="form-control" />
                        </div>
                        <div className="pb-3">
                            <h6>Stock :</h6>
                            <input type="text" ref={(e) => this.stock = e} className="form-control" />
                        </div>
                        <div>
                            <h6>Select Images :</h6>
                        </div>
                        <div className="row border px-3 py-3 mx-1 rounded">
                            <div className="col-6">
                                <div>
                                    <input type="file" ref={e => this.files = e} accept="image/*" multiple onChange={this.onImagesValidation} style={{display: 'none'}} />
                                    <input type="button" value="Choose File" onClick={() => this.files.click()} className="btn btn-outline-dark" />
                                </div>
                            </div>
                            <div className="col-6">
                                {
                                    this.state.totalFile?
                                        this.state.totalFile + 'Files Selected'
                                    :
                                        'No File Chosen'
                                }
                            </div>
                        </div>
                        <div style={{fontStyle:'italic',color:'red',textAlign:'center'}}>
                            <h6>
                                {
                                    this.state.imagesErrorMessage?
                                        this.state.imagesErrorMessage
                                    :
                                        null
                                }
                            </h6>
                        </div>
                        <div className="my-3">
                            <input type="button" value="Submit Data" onClick={() => this.onSubmitData()} className="btn btn-dark btn-lg active w-100" />
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}