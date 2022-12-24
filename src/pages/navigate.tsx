type Props = {
    postsPerPage: number;
    totalPosts: number;
    paginate: (val: number) => void;
    previousPage: () => void;
    nextPage: () => void;
}

export default function Navigate({ postsPerPage, totalPosts, paginate, previousPage, nextPage }: Props) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination-container">
            <ul className="pagination">
                <li onClick={previousPage} className="page-number">
                    Prev
                </li>
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        onClick={() => paginate(number)}
                        className="page-number"
                    >
                        {number}
                    </li>
                ))}
                <li onClick={nextPage} className="page-number">
                    Next
                </li>
            </ul>
        </div>
    )
}