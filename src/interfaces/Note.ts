export interface Note {
    id: string,
    user: string,
    date: string,
    noteBody: string,
    comments: { 
        author: string,
        date: string
        comment: string
     }[]
}