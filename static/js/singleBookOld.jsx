// Single book old return
<Container className="book-big-container">
  <Row className="justify-content-center">
    <Col md={8} className={bookIsUsers ? "book-big myBook w-100" : "book-big w-100"}>
      <div className="add-remove-container">
        {bookIsUsers 
          ? (<label className="remove-book">
              Remove Book
              <button className="book-add-remove" onClick={removeBook}>
                <i className="fas fa-minus"></i>
              </button>
            </label>) 
          : <label>
              Add Book
              <button className="book-add-remove" onClick={addBook}>
                <i className="fas fa-plus"></i>
              </button> 
            </label>
        }
      </div>
      <div className="title">
        {book.title}
      </div>
      <div>
        <img className="book-image-big" src={book.image ? book.image : '/static/img/BookPlaceholder.png'}/>
      </div>
      <div className="authors">
        {book.authors ? book.authors.map(author =>
          (<div key={author}>{author}</div>)) : ''
        }
      </div>

      {book.description ? (<div className="text-left book-desc"><b>Description: </b>{book.description} </div>) : ''}

      {book.publisher ? (<div className="text-left">Publisher: {book.publisher} </div>) : ''}

      {book.year ? (<div className="text-left">Publication Year: {book.year} </div>) : ''}

      {book.isbn ? (<div className="text-left">ISBN: {book.isbn}</div>) : ''}

      <div className="tags w-100">
        <div className="center-text">General Tags:</div>
        {book.tags 
          ? (<span>{book.tags.map(tag =>
              (<Badge pill variant="info" className="tag-button"key={tag}>{tag}</Badge>))}</span>) 
          : ''
        }
      </div>
      
      <div className="rating">Average Rating: {book.avgRating}</div>

      {bookIsUsers 
        ? <Container className="rating-user">
            <Row> 
              <b>Your rating:</b> {book.userScore}
            </Row>
            <Row className="text-left">
              <b>Your review:</b> {book.userReview}
            </Row>
            <Row>
              <Col sm={{span: 6, offset: 6}}>
                <button className="button-rating-add" onClick={handleShow}>
                  {book.userScore ? "Update rating/review" : "Add rating/review"}
                </button>
              </Col>
            </Row>
          </Container>
        : ''
      }
    </Col>
  </Row>
  <Modal
    show={show}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header className="modal-rating-header">
      <Modal.Title className="text-center w-100">Update Rating &amp; Review</Modal.Title>
    </Modal.Header>
    <Modal.Body className="modal-rating">
      <label htmlFor="review">New Review:
        <textarea rows="5" cols="30" id="review" name="review" placeholder="Enter your review"/>
      </label>
      <br/>
      <label htmlFor="rating">Rating: </label>
      <select id="rating" type="dropdown">
        <option value="1"defaultValue>1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
    </Modal.Body>
    <Modal.Footer className="modal-rating-footer w-100">
      <Container>
        <Row>
          <Col sm={3}>
          </Col>
          <Col sm={6}>
            <Button className="modal-rating-button" onClick={handleSaveRating}>
                Save changes
            </Button>
          </Col>
          <Col sm={3}>
            <Button className="modal-rating-button" onClick={handleCancel}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Container>
    </Modal.Footer>
  </Modal>
</Container>