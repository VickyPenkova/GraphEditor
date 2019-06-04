import nltk
import json
import os

dir_path = os.path.dirname(os.path.realpath(__file__))

def tag(input_text):
    print(dir_path)
    text = nltk.word_tokenize(input_text)

    tagged = nltk.pos_tag(text)

    return construct_graph(tagged)

def construct_graph(tagged):

    with open(os.path.join(dir_path, 'graph.json')) as f:
        graph = json.load(f)

    for idx, tag in enumerate(tagged):
        graph['graph']['nodes'].append({'id': idx, 'data': tag[0]})
        graph['graph']['edges'].append({'source': idx, 'target': tag[1]})

    return json.dumps(graph)


#Source for the meaning of the labels
#https://medium.com/@gianpaul.r/tokenization-and-parts-of-speech-pos-tagging-in-pythons-nltk-library-2d30f70af13b
LABEL_MAPPINGS = {
    'CC': 'coordinating conjunction',
    'CD': 'cardinal digit',
    'DT': 'determiner',
    'EX': 'existential there', #(like: “there is” … think of it like “there exists”)
    'FW': 'foreign word',
    'IN': 'preposition/subordinating conjunction',
    'JJ': 'adjective',
    'JJR': 'adjective, comparative', #‘bigger’
    'JJS': 'adjective, superlative', #‘biggest’
    'LS': 'list marker', #1)
    'MD': 'modal could', #will
    'NN': 'noun singular',#‘desk’
    'NNS': 'noun plural',#‘desks’
    'NNP': 'proper noun, singular',#‘Harrison’
    'NNPS': 'proper noun, plural',#‘Americans’
    'PDT': 'predeterminer',#‘all the kids’
    'POS': 'possessive ending',#parent’s
    'PRP': 'personal pronoun',#I, he, she
    'PRP$': 'possessive pronoun',#my, his, hers
    'RB': 'adverb',#very, silently
    'RBR': 'adverb, comparative',#better
    'RBS': 'adverb, superlative',#best
    'RP': 'particle',#give up
    'TO': 'to',#to go ‘to’ the store.
    'UH': 'interjection',#errrrrrrrm
    'VB': 'verb',#base form take
    'VBD': 'verb, past tense',#took
    'VBG': 'verb, gerund/present participle',#taking
    'VBN': 'verb, past participle',#taken
    'VBP': 'verb, sing. present, non-3d',#take
    'VBZ': 'verb, 3rd person sing. present',#takes
    'WDT': 'wh-determiner',#which
    'WP': 'wh-pronoun',#who, what
    'WP$': 'possessive wh-pronoun',#whose
    'WRB': 'wh-abverb'#where, when
}

#TO SETUP THE NLTK DEPENDENCIES RUN THIS:

# import nltk
# import ssl
#
# try:
#     _create_unverified_https_context = ssl._create_unverified_context
# except AttributeError:
#     pass
# else:
#     ssl._create_default_https_context = _create_unverified_https_context
#
# nltk.download()