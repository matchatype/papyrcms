import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { connect } from 'react-redux'
import keys from '../../config/keys'


const Pages = props => {

  const { currentUser, pages } = props

  if (!currentUser || !currentUser.isAdmin) {
    return <div />
  }

  const renderPages = () => {

    return pages.map(page => (
      <li className='pages__page' key={page._id}>
        <div className='pages__link--visit'>
          Visit page{" - "}
          <Link href="/[page]" as={`/${page.route}`}>
            <a>/{page.route}</a>
          </Link>
        </div>

        <div className='pages__link-divider'>|</div>

        <div className='pages__link--edit'>
          Edit page{" - "}
          <Link href={`/admin/pages/${page.route}`}>
            <a>/admin/pages/{page.route}</a>
          </Link>
        </div>
      </li>
    ))
  }


  return (
    <div className="pages-page">
      <h2 className="heading-secondary">Pages</h2>
      <ul className="pages">
        {renderPages()}
      </ul>
    </div>
  )
}


Pages.getInitialProps = async ({ req }) => {

  let axiosConfig = {}

  // Depending on if we are doing a client or server render
  if (!!req) {
    axiosConfig = {
      withCredentials: true,
      headers: {
        Cookie: req.headers.cookie || ''
      }
    }
  }

  const rootUrl = keys.rootURL ? keys.rootURL : ''
  const { data: pages } = await axios.get(`${rootUrl}/api/pages`, axiosConfig)

  return { pages }
}


const mapStateToProps = state => {
  return { pages: state.pages, currentUser: state.currentUser }
}


export default connect(mapStateToProps)(Pages)