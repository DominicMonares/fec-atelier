import React from 'react';
import Modal from 'react-modal';

class ReviewImages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      activePicURL: ''
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal = (e) => {
    e.preventDefault();
    this.props.render(e);
    this.setState({
      modalOpen: true,
      activePicURL: e.target.dataset.mssg
    });
  }

  closeModal = (e) => {
    e.preventDefault();
    this.props.render(e);
    this.setState({
      modalOpen: false
    });
  }

  render(props) {

    if (this.props.photos) {
      if (this.props.photos.length > 0) {
        const photos = this.props.photos;
        return (
          <div className="reviewImages" data-testid="review-images">
            <div>
              <ul className="product_breakdown">
                {photos.map((url) =>
                  <li key={url.id}>
                    <img className="review_image" src={url.url} alt="Loading" data-mssg={url.url} onClick={this.openModal}></img>
                  </li>
                )}
              </ul>
            </div>
            <Modal isOpen={this.state.modalOpen} className="modalWindow">
              <img className="modal_image" src={this.state.activePicURL} onClick={this.closeModal}></img>
            </Modal>
          </div>
        )
      } else {return <div></div>}
    } else {return <div></div>}
  }
}

export default ReviewImages;
