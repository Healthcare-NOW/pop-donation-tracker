import csv


def chunked(generator, chunksize=100):
    buffer = []
    for item in generator:
        if len(buffer) == chunksize:
            yield buffer
            buffer = []
        buffer.append(item)
    if buffer:
        yield buffer


def read_csv(filename, fieldnames):
    with open(filename) as csv_file:
        reader = csv.DictReader(csv_file, fieldnames=fieldnames, delimiter="|")
        for row in reader:
            yield {key: row[key] or None for key in row}
