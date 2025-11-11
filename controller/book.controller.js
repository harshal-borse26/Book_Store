import Book from "../model/book.model.js"
import cloudinary from "../config/cloud.js"


export const addBook = async (req, res) => {
    try {
        const { title, author, price, desc, language, stock } = req.body;

        if (!title || !author || !desc || !price || !language || !stock) {
            return res.status(400).json({
                message: "All fields are required!!"
            })
        }

        let imageUrl = undefined;

        if (req.file) {
            try {
                const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
                const uploadResult = await cloudinary.uploader.upload(base64Image, { folder: "books" })
                imageUrl = uploadResult.secure_url;
            } catch (error) {
                console.error(error);
                res.status(500).json({
                    message: "Image upload error"
                })
            }
        }

        const newBook = await Book.create({
            title, author, price, desc, language, stock , imageUrl
        })

        res.status(201).json({
            success: true,
            message: "Book created",
            newBook,
        })

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}


export const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json({
            success: true,
            count : books.length,
            books
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}


export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if(!book){
            return res.status(404).json({
                message: "Book not find"
            })
        }

        res.status(200).json({
            success: true,
            book
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}