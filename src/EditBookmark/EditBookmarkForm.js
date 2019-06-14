import React, { Component } from 'react';
import BookmarksContext from '../BookmarksContext';
import config from '../config';

export default class EditBookmarkForm extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			url: '',
			description: '',
			rating: null,
			error: null
		};
		this.handleChange = this.handleChange.bind();
		this.handleSubmit = this.handleSubmit.bind();
	}
	componentDidMount() {
		const bookmarkId = this.props.match.params.bookmarkId;
		console.log(bookmarkId);

		fetch(`http://localhost:8000/api/bookmarks/${bookmarkId}`, {
			method: 'GET',
			headers: {
				authorization: `bearer ${config.API_KEY}`
			}
		})
			.then(res => {
				if (!res.ok) {
					return res.json().then(error => Promise.reject(error));
				}
				return res.json();
			})
			.then(data => {
				this.setState({
					title: data.title,
					url: data.url,
					description: data.description,
					rating: data.rating
				});
			})
			.catch(error => {
				console.error(error);
				this.setState({ error: error });
			});
	}

	handleChange = () => {
		const newTitle = this.textInput.current.focusTextInput();
		const newUrl = this.textInput.current.focusTextInput();
		const newDescription = this.textInput.current.focusTextInput();
		const newRating = this.textInput.current.focusTextInput();

		this.setState({
			title: newTitle,
			url: newUrl,
			description: newDescription,
			rating: newRating
		});
		console.log(this.state);
	};
	handleSubmit = (cb, e) => {
		console.log('handlesumbit');
		if (e) e.preventDefault();
		console.log(this.state);
		fetch(
			`http://localhost:8000/api/bookmarks/${
				this.props.match.params.bookmarkId
			}`,
			{
				method: 'PATCH',
				headers: {
					authorization: `bearer ${config.API_KEY}`
				},
				body: JSON.stringify(this.state)
			}
		).then(data => {
			cb(data);
		});
	};
	render() {
		const { title, url, description, rating } = this.state;
		return (
			<BookmarksContext.Consumer>
				{context => (
					<section className='EditBookmarkForm'>
						<h2>Edit Bookmark</h2>
						<form>
							<label htmlFor='title'>
								Title:
								<input
									type='text'
									name='title'
									ref={this.textInput}
									className='editBookmarkInput'
									id='editTitle'
									defaultValue={title}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor='url'>
								URL:
								<input
									type='text'
									name='url'
									ref={this.textInput}
									className='editBookmarkInput'
									id='editUrl'
									defaultValue={url}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor='description'>
								Description:
								<input
									type='text'
									name='description'
									ref={this.textInput}
									className='editBookmarkInput'
									id='editDescription'
									defaultValue={description}
									onChange={this.handleChange}
								/>
							</label>
							<label htmlFor='rating'>
								Rating:
								<input
									type='number'
									name='rating'
									ref={this.textInput}
									className='editBookmarkInput'
									id='editRating'
									defaultValue={rating}
									onChange={this.handleChange}
								/>
							</label>

							<button
								type='submit'
								onclick={this.handleSubmit(context.updateBookmark)}>
								Submit
							</button>
						</form>
					</section>
				)}
			</BookmarksContext.Consumer>
		);
	}
}
