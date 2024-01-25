import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Table from './Table';

const IndexPage: React.FC<PageProps> = () => {
  return (
    <div>
        <Table />
    </div>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
