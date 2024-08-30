import { Application } from 'express'
import Wiki, { IWiki } from '../models/Wiki'
import User, { IUser } from '../models/User'

export default function WikiAPI(app: Application, BASEURL: string) {
    // GET
    app.get(BASEURL + '/',  async (req, res) => {
        try {
            const { wikiName } = req.query

            const currentUser = await User.findById(req.userId)

            if(wikiName) {
                const wiki: IWiki | null = await Wiki.findOne({name: wikiName})

                if(!wiki) return res.staus(404).send('Could not find a wiki with that name.')

                if(!currentUser.wikis.includes(wiki._id)) {
                    return res.status(401).send('You are not a member of this wiki.')
                }

                return res.json(wiki)
            }

            const wikis: IWiki[] = await Wiki.find({_id: {$in: currentUser.wikis }})
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

     // GET
     app.get(BASEURL + '/:id/members/',  async (req, res) => {
        try {
            const wikiId = req.params.id
            const members = await User.find({wikis: { $in: [wikiId]}})
            res.json(members)
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

            // Add the creator of the wiki as a member
            const currentUser = await User.findById(req.userId)
            currentUser.wikis.push(newWiki._id)
            await currentUser.save()

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
    // Making this was a mess.
    
    app.put(BASEURL + '/:wikiId/members', async (req, res) => {
        try {
            const { userIds } = req.body
            const { wikiId } = req.params
            
            const oldMembersList = await User.find({wikis: { $in: [wikiId]}})    
            const newMembersList = await User.find({ _id:{ $in: userIds } })

            const toBeRemoved = oldMembersList.filter(oldMember => 
                !newMembersList.some(newMember => newMember._id == oldMember._id)
            )
            
            const toBeAdded = newMembersList.filter(newMember => 
                !oldMembersList.some(oldMember => oldMember._id == newMember._id)
            )

            const thisUser: IUser = await User.findById(req.userId)

            if(!thisUser) {
                return res.status(401).send('You are not signed in in. Please reload the site.')
            }

            // Check if the user making this request is part of the wiki it wants to add another user to.
            if(!thisUser.wikis.includes(wikiId)) {
                return res.status(401).send('You must be part of a wiki to add another user to it.')
            }

            await User.updateMany(
                { _id: { $in: toBeRemoved.map(user => user._id) } },
                { $pull: { wikis: wikiId } }
            )

            await User.updateMany(
                { _id: { $in: toBeAdded.map(user => user._id) } },
                { $addToSet: { wikis: wikiId } }
            )

            res.json(newMembersList.map(member => {
                const { password, ...safeMember } = member.toObject()
                return safeMember
            }))
        } catch (error) {
            console.log(error)
            console.log("MEN ASSSÅÅÅÅ")
            res.status(500).send('An error occurred')
        }
    })
}