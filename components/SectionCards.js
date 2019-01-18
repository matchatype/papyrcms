import React, { Component } from 'react'
import _ from 'lodash'
import renderHTML from 'react-render-html'
import Link from 'next/link'

class SectionCards extends Component {

  renderReadMore( post ) {

    if ( this.props.readMore ) {
      return (
        <Link href={ `/posts_show?id=${post._id}` } as={ `/posts/${post._id}` }>
          <a className="section-cards__link">Read More</a>
        </Link>
      )
    }
  }


  renderPosts() {

    // Set defaults for contentLength
    const contentLength = this.props.contentLength || 300

    return _.map( this.props.posts, post => {
      let postContent = post.content.length >= contentLength ? `${post.content.substring( 0, contentLength ).trim()} . . .` : post.content

      return (
        <li key={post._id} className="section-cards__card">
          <h3 className="section-cards__title">{ post.title }</h3>
          <img className="section-cards__image" src={ post.mainImage } />
          <div className="section-cards__content">{ renderHTML( postContent ) }</div>
          {this.renderReadMore( post )}
        </li>
      )
    })
  }


  render() {

    return (
      <section className='section-cards'>
        <h2 className='heading-secondary section-cards__header'>{ this.props.title }</h2>
        <ul className='section-cards__list'>
          {this.renderPosts()}
        </ul>
      </section>
    )
  }
}


export default SectionCards