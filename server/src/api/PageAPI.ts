import { Application, Request, Response } from 'express'
import mongoose from "mongoose"

import Page, { IPage } from '../models/Page'
import User, { IUser } from '../models/User'
import PageRecord from "../models/PageRecord"
import Wiki, { IWiki } from '../models/Wiki'

export default function PageAPI(app: Application, BASEURL: string) {

    // GET
    app.get(BASEURL + '/',  async (req, res) => {
        try {
            const { wikiName } = req.query
            let pages: IPage[]

            if(wikiName) {
                const wiki: IWiki | null = await Wiki.findOne({name: wikiName})

                if(!wiki) {
                    return res.status(404).send('No wiki with that name was found.')
                }
                pages = await Page.find({wikiId: wiki._id})
            }
            else {
                pages = await Page.find()
            }
            
            res.json(pages)
        } catch (error) {
            res.status(500).send('An error occurred' )
        }
    })

    // GET
    app.get(BASEURL + '/:id',  async (req, res) => {
        try {
           // await new Promise((resolve) => setTimeout(() => resolve(2), 5000));
            const pageId = req.params.id
            const page: IPage[] = await Page.findById(pageId)
            res.json(page)
        } catch (error) {
            res.status(500).send('An error occurred' )
        }
    })

    // POST
    app.post(BASEURL + '/', async (req, res) => {
        try {
            const { content, infoSection, authors, wikiId } = req.body
            
            if(!isMemberOfWiki(req, wikiId)) {
                return res.status(401).send('You cannot create a page in a wiki you are not a member of.')
            }

            addAuthorIfNotPresent(req.userId, authors)

            const newPage: IPage = new Page({
                content,
                infoSection,
                authors,
                wikiId
            })

            const createdPage: IPage = await newPage.save()
            res.status(201).json(createdPage)
        } catch (error) {
            console.log(error)
            res.status(500).send('An error occurred')
        }
    })

    // PUT
    app.put(BASEURL + '/:id', async (req, res) => {
        try {
            const pageId = req.params.id
            const { content, infoSection, authors, wikiId } = req.body

            if(!isMemberOfWiki(req, wikiId)) {
                return res.status(401).send('You cannot edit a page in a wiki you are not a member of.')
            }

            addAuthorIfNotPresent(req.userId, authors)

            const updatedPage: IPage | null = await Page.findByIdAndUpdate(
                pageId,
                { content, infoSection, authors },
                { new: true }
            )

            if (!updatedPage) {
                return res.status(404).send('Page not found')
            }

            const numberOfRecords = await PageRecord.count({'page._id': new mongoose.Types.ObjectId(pageId)})

            await new PageRecord({
                page: updatedPage,
                versionNumber: numberOfRecords,
                time: Date.now(),
                author: req.userId
            }).save()

            res.json(updatedPage)
        } catch (error) {
            console.log(error)
            res.status(500).send('An error occurred')
        }
    })

    // DELETE
    app.delete(BASEURL + '/:id', async (req, res) => {
        try {
            const pageId = req.params.id

            const page: IPage = await Page.findById(pageId)

            if(!isMemberOfWiki(req, page.wikiId)) {
                return res.status(401).send('You cannot delete a page in a wiki you are not a member of.')
            }

            const deletedPage: IPage | null = await Page.findByIdAndDelete(pageId)

            if (!deletedPage) {
                return res.status(404).send('Page not found')
            }

            res.json({ message: 'Page deleted.' })
        } catch (error) {
            res.status(500).send('Something went wrong when deleting post.')
        }
    })
}

function addAuthorIfNotPresent(userId, authors: any) {
    if(!authors.includes(userId)) {
        authors.push(userId)
    }
}

async function isMemberOfWiki(req: Request, wikiId: string) {
    const thisUser: IUser | null = await User.findById(req.userId)

    if(!thisUser) {
        return false
    }

    if(!thisUser.wikis.includes(wikiId)) {
        return false
    }

    return true
}