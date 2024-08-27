import { Application } from 'express'
import Wiki, { IWiki } from '../models/Wiki'
import User, { IUser } from '../models/User'

export default function WikiAPI(app: Application, BASEURL: string) {
    console.log(BASEURL)
    // GET
    app.get(BASEURL + '/',  async (req, res) => {
        try {
            const wikis: IWiki[] = await Wiki.find()
            res.json(wikis)
        } catch (error) {
            res.status(500).send('An error occurred' )
        }
    })

    // GET
    app.get(BASEURL + '/:id',  async (req, res) => {
        try {
            const WikiId = req.params.id
            const wiki: IWiki[] = await Wiki.findById(WikiId)
            res.json(wiki)
        } catch (error) {
            res.status(500).send('An error occurred' )
        }
    })

    // POST
    app.post(BASEURL + '/', async (req, res) => {
        try {
            const { description, img, name } = req.body

            const newWiki: IWiki = new Wiki({
                description,
                img,
                name
            })

            const createdWiki: IWiki = await newWiki.save()
            res.status(201).json(createdWiki)
        } catch (error) {
            console.log(error)
            res.status(500).send('An error occurred')
        }
    })

    // PUT
    app.put(BASEURL + '/:id', async (req, res) => {
        try {
            const WikiId = req.params.id
            const { description, img } = req.body

            const updatedWiki: IWiki | null = await Wiki.findByIdAndUpdate(
                WikiId,
                { description, img },
                { new: true }
            )

            if (!updatedWiki) {
                return res.status(404).send('Wiki not found')
            }

            res.json(updatedWiki)
        } catch (error) {
            console.log(error)
            res.status(500).send('An error occurred')
        }
    })

    // DELETE
    app.delete(BASEURL + '/:id', async (req, res) => {
        try {
            const WikiId = req.params.id

            const deletedWiki: IWiki | null = await Wiki.findByIdAndDelete(WikiId)

            if (!deletedWiki) {
                return res.status(404).send('Wiki not found')
            }

            res.json({ message: 'Wiki deleted.' })
        } catch (error) {
            res.status(500).send('Something went wrong when deleting post.')
        }
    })

    // PUT
    app.put(BASEURL + '/addUserToWiki', async (req, res) => {
        try {
            const { wikiId, userId } = req.body

            const userToBeAdded = await User.findById(userId)

            if(!userToBeAdded) {
                return res.status(404).send('User to be added to wiki was not found.')
            }

            const thisUser: IUser = await User.findById(req.userId)

            if(!thisUser) {
                return res.status(401).send('You are not signed in in. Please reload the site.')
            }

            // Check if the user making this request is part of the wiki it wants to add another user to.
            if(!thisUser.wikis.includes(wikiId)) {
                return res.status(401).send('You must be part of a wiki to add another user to it.')
            }

            // Check is user is already part of that wiki.
            if(userToBeAdded.wikis.includes(wikiId)) {
                return res.status(418).send('User is already part of that wiki')
            }

            userToBeAdded.wikis.push(wikiId)

            const updatedUser = await userToBeAdded.save()

            if (!updatedUser) {
                return res.status(404).send('User not found')
            }

            delete updatedUser.password

            res.json(updatedUser)
        } catch (error) {
            console.log(error)
            res.status(500).send('An error occurred')
        }
    })
}