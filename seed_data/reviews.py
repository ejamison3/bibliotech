import json
from flask import jsonify

def get_reviewId(filename, outfile):
    """Create dictionary of reviewerID and number of reviews per that reviewer"""

    reviews_file = open(filename)
    review_id_dict = {}

    out_file = open(outfile, 'w')

    for review in reviews_file:
        # print(review)
        review_dict = json.loads(review)
        reviewer_id = review_dict["reviewerID"]
        # print(reviewer_id)
        review_id_dict[reviewer_id] = review_id_dict.get(reviewer_id, 1)
    
    out_file.write(str(review_id_dict))
    return review_id_dict


def get_pipe_reviewId(filename, outfile):
    """Create a pipe-separated list of reviewerIds"""

    reviews_file = open(filename)
    review_id_list = []

    out_file = open(outfile, 'w')

    for review in reviews_file:
        review_dict = json.loads(review)
        reviewer_id = review_dict["reviewerID"]

        review_id_list.append(reviewer_id)

    reviewer_id_string = "|".join(review_id_list)
    out_file.write(reviewer_id_string)

    reviews_file.close()
    out_file.close()


def get_reviewers_by_book(filename, outfile):
    """Creates a file where key is asin and value is list of reviewerID"""

    reviews_file = open(filename)
    review_asin_dict = {}

    out_file = open(outfile, 'w')

    for review in reviews_file:
        review_dict = json.loads(review)
        reviewer_id = review_dict["reviewerID"]
        asin = review_dict["asin"]

        review_asin_dict[asin] = review_asin_dict.get(asin,[])
        review_asin_dict[asin].append(reviewer_id)

    keys = review_asin_dict.keys()
    for key in keys:
        out_file.write(f'{key}: {review_asin_dict[key]}\n')
   
    # return review_asin_dict


def get_unique_asin(filename, outfile):
    """Output a file with unique asin (book identifier) per line"""

    reviews_file = open(filename)
    review_asin_set = set()

    out_file = open(outfile, 'a')

    for review in reviews_file:
        review_dict = json.loads(review)
        asin = review_dict["asin"]

        if asin not in review_asin_set:
            out_file.write(f'{asin}\n')
            review_asin_set.add(asin)
    
    out_file.close()
    reviews_file.close()


def get_reviewer_count_by_book(filename, outfile):
    """Creates dictionary where key is asin and value is count of reviewerID"""

    reviews_file = open(filename)
    review_asin_dict = {}

    out_file = open(outfile, 'w')

    for review in reviews_file:
        review_dict = json.loads(review)
        reviewer_id = review_dict["reviewerID"]
        asin = review_dict["asin"]

        review_asin_dict[asin] = review_asin_dict.get(asin,0) + 1
        # review_asin_dict[asin].append(reviewer_id)

    keys = review_asin_dict.keys()
    for key in keys:
        out_file.write(f'{key}: {review_asin_dict[key]}\n')

    # return review_asin_dict


def get_books_by_reviewer(filename, outfile):
    """Create a file where each line has reviewer id with list of book ids"""

    reviews_file = open(filename)
    reviewers_dict = {}

    out_file = open(outfile, 'w')

    for review in reviews_file:
        review_dict = json.loads(review)
        reviewer_id = review_dict["reviewerID"]
        asin = review_dict["asin"]

        reviewers_dict[reviewer_id] = reviewers_dict.get(reviewer_id,[])
        reviewers_dict[reviewer_id].append(asin)

    keys = reviewers_dict.keys()
    for key in keys:
        out_file.write(f'{key}: {reviewers_dict[key]}\n')
    # out_file.write(str(review_asin_dict))
    # return reviewers_dict


def get_book_count_by_reviewer(filename, outfile, min_book_count=1, max_book_count=5000):
    """Create a file where each line has reviewer id with list of book ids"""

    reviews_file = open(filename)
    reviewers_dict = {}

    out_file = open(outfile, 'w')

    for review in reviews_file:
        review_dict = json.loads(review)
        reviewer_id = review_dict["reviewerID"]
        asin = review_dict["asin"]

        reviewers_dict[reviewer_id] = reviewers_dict.get(reviewer_id,0) + 1
        # reviewers_dict[reviewer_id].append(asin)

    keys = reviewers_dict.keys()
    keys_string = ""
    for key in keys:
        book_count = reviewers_dict[key]
        if book_count >= min_book_count and book_count <= max_book_count:
            out_file.write(f'{key}: {reviewers_dict[key]}\n')
            keys_string = keys_string + f'|{key}'
    

    return keys_string


def get_ids(filename):
    """Gets IDs (i.e., value before :) and prints to terminal"""

    f = open(filename)
    output_string = ""

    for line in f:
        idx = line.find(':')

        if idx == -1:
            print(f'ERROR: {line}')
        else:
            id = line[:idx]
            output_string = output_string + f"|{id}"
    
    return output_string


def make_book_id_file(filename, outfile):
    """Create file with unique book id (asin) on each line"""

    reviews_file = open(filename)
    unique_asin_set = set()

    out_file = open(outfile, 'w')

    for review in reviews_file:
        review_dict = json.loads(review)
        asin = review_dict["asin"]

        unique_asin_set.add(asin)
        # review_asin_dict[asin].append(reviewer_id)

    for asin in unique_asin_set:
        out_file.write(f'{asin}\n')


def save_json_on_single_line(filename, seed_file, idx, isbn):

    f = open(filename)
    seed_file = open(seed_file, 'a')
    res_dict = json.load(f)
    item = res_dict['items'][idx]
    volume_info = item['volumeInfo']
    volume_info['isbn'] = isbn
    volume_info_json = json.dumps(volume_info)
    seed_file.write(f'{volume_info_json}\n')

