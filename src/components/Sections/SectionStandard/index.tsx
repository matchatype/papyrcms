import React, { useContext } from 'react'
import axios from 'axios'
import _ from 'lodash'
import Link from 'next/link'
import Router from 'next/router'
import renderHTML from 'react-render-html'
import userContext from '../../../context/userContext'
import postsContext from '../../../context/postsContext'
import Comment from './Comment'
import Media from '../../Media'
import PageHead from '../../PageHead'
import filterPosts from '../../../hooks/filterPosts'

type Props = {
  post: Post | Blog | event | Product,
  enableCommenting?: boolean,
  apiPath?: string,
  className?: string,
  redirectRoute?: string,
  path?: string,
  emptyTitle?: string,
  emptyMessage?: string,
  beforePost?: Function,
  afterPost?: Function,
  beforeTitle?: Function,
  afterTitle?: Function,
  beforeMainMedia?: Function,
  afterMainMedia?: Function,
  beforeContent?: Function,
  afterContent?: Function,
  beforeComments?: Function,
  afterComments?: Function,
  beforeCommentForm?: Function,
  afterCommentForm?: Function
}

/**
 * SectionStandard is the main component to show the details of a particular post
 *
 * @prop post - Object - The post that will be displayed on the page
 * @prop enableCommenting - Boolean - Whether or not users can comment on this post
 * @prop path - String - The prefix for accessing the edit page
 * @prop apiPath - String - The api prefix for CRUD operations
 * @prop redirectRoute - String - The route to redirect to after deleting the post
 * @prop className - String - Any additional classes to wrap the component
 * @prop emptyTitle - String - A title to display when there is no post passed
 * @prop emptyMessage - String - A message to display when there is no post passed
 *
 * Post Hooks
 * @prop beforePost - Function - Rendered before the post
 * @prop afterPost - Function - Rendered after the post
 * @prop beforeTitle - Function - Rendered before the post title
 * @prop afterTitle - Function - Rendered after the post title
 * @prop beforeMainMedia - Function - Rendered before the post main media
 * @prop afterMainMedia - Function - Rendered after the post main media
 * @prop beforeContent - Function - Rendered before the post content
 * @prop afterContent - Function - Rendered after the post content
 * @prop beforeComments - Function - Rendered before the post comments
 * @prop afterComments - Function - Rendered after the post comments
 * @prop beforeCommentForm - Function - Rendered before the post comment form
 * @prop afterCommentForm - Function - Rendered after the post comment form
 */
const SectionStandard = (props: Props) => {

  if (!props.post) return null

  const { currentUser } = useContext(userContext)
  const { posts, setPosts } = useContext(postsContext)

  const {
    post, enableCommenting,
    apiPath, className, redirectRoute,
    path, emptyTitle, emptyMessage,

    // Hook functions
    beforePost = () => null,
    afterPost = () => null,
    beforeTitle = () => null,
    afterTitle = () => null,
    beforeMainMedia = () => null,
    afterMainMedia = () => null,
    beforeContent = () => null,
    afterContent = () => null,
    beforeComments = () => null,
    afterComments = () => null,
    beforeCommentForm = () => null,
    afterCommentForm = () => null
  } = props
  const { title, tags, mainMedia, content, published } = post
  let postContent = content || ''


  const onDeleteClick = () => {

    const confirm = window.confirm('Are you sure you want to delete this post?')

    if (confirm) {
      const deletePath = apiPath ? apiPath : '/api/posts'
      const deleteRedirect = redirectRoute ? redirectRoute : '/posts'

      axios.delete(`${deletePath}/${post._id}`)
        .then(res => {
          const newPosts = _.filter(posts, filtered => filtered._id !== post._id)
          setPosts(newPosts)
          Router.push(deleteRedirect)
        }).catch(error => {
          console.error(error)
        })
    }
  }


  const renderAuthOptions = () => {

    if (
      currentUser &&
      currentUser.isAdmin
    ) {
      return (
        <div className="post__buttons">
          <button className="button button-delete" onClick={onDeleteClick}>Delete</button>
          <Link href={`/${path}/[id]/edit`} as={`/${path}/${post._id}/edit`}>
            <button className="button button-edit">Edit</button>
          </Link>
        </div>
      )
    }
  }


  const renderTags = () => {
    return _.map(tags, (tag, i) => {
      if (i < tags.length - 1) {
        return <span key={tag}>{tag}, </span>
      } else {
        return <span key={tag}>{tag}</span>
      }
    })
  }


  const renderTagsSection = () => {
    if (
      tags &&
      tags[0] &&
      currentUser &&
      currentUser.isAdmin
    ) {
      return <p className="post__tags">Tags: <em>{renderTags()}</em></p>
    }
  }


  const renderMainMedia = () => {
    if (mainMedia) {
      return (
        <div className="post__image">
          <Media src={mainMedia} alt={title} />
        </div>
      )
    }
  }


  const renderPublishSection = () => {
    if (!published) {
      return <p><em>Not published</em></p>
    }
  }


  const renderComments = () => {
    return (
      <Comment
        post={post}
        comments={post.comments}
        enableCommenting={!!enableCommenting}
        apiPath={apiPath}

        beforeCommentForm={beforeCommentForm}
        afterCommentForm={afterCommentForm}
      />
    )
  }


  if (
    !post ||
    Object.keys(post).length == 0
  ) {
    return (
      <div className={`posts-show ${className || ''}`}>
        <h2 className="heading-secondary">{emptyTitle}</h2>
        <h3 className="heading-tertiary">{emptyMessage}</h3>
      </div>
    )
  }

  let headTitle
  const headerSettings = {
    maxPosts: 1,
    postTags: ['section-header']
  }
  const { posts: [headerPost] } = filterPosts(posts, headerSettings)
  if (headerPost && title) {
    headTitle = `${headerPost.title} | ${title}`
  }

  return (
    <div className={`posts-show ${className || ''}`}>

      <PageHead
        title={headTitle}
        image={mainMedia}
        description={postContent.replace('<p>', '').replace('</p>', '')}
        keywords={tags.toString()}
      />

      {beforePost()}

      <div className="post">
        {renderPublishSection()}

        {beforeTitle()}
        <h2 className="heading-secondary post__title u-margin-bottom-small">{title}</h2>
        {afterTitle()}

        {renderTagsSection()}

        {beforeMainMedia()}
        {renderMainMedia()}
        {afterMainMedia()}

        {beforeContent()}
        <div className="post__content">{renderHTML(postContent)}</div>
        {afterContent()}

        {renderAuthOptions()}

        {beforeComments()}
        {renderComments()}
        {afterComments()}
      </div>

      {afterPost()}
    </div>
  )
}


export default SectionStandard