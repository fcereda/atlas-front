import urllib2
import hashlib
import os

baseURL = "http://cepesp.io/api/consulta/"
baseDir = os.path.dirname(__file__)

def add_filter(request, column, value, index):
    filter = "&columns[{}][name]={}&columns[{}][search][value]={}".format(index, column, index, value)
    return request + filter

def add_filters(request,
                estado=None,
                numero_candidato=None,
                numero_partido=None,
                codigo_municipio=None):
    index = 0
    if (estado != None):
        request = add_filter(request, "UF", estado, index)
        index += 1
    if (numero_candidato != None):
        request = add_filter(request, "NUMERO_CANDIDATO", numero_candidato, index)
        index += 1
    if (numero_partido != None):
        request = add_filter(request, "NUMERO_PARTIDO", numero_partido, index)
        index += 1
    if (codigo_municipio != None):
        request = add_filter(request, "CODIGO_MUNICIPIO", codigo_municipio, index)
        index += 1
    return request


def votos(cargo=1,
          ano=2014,
          agregacao_politica=1,
          agregacao_regional=0,
          estado=None,
          numero_candidato=None,
          numero_partido=None,
          codigo_municipio=None):
    request = "votos?cargo={}&ano={}&agregacao_politica={}&agregacao_regional={}&format=gzip".format(cargo, ano,
                                                                                                     agregacao_politica,
                                                                                                     agregacao_regional)
    request = add_filters(request, estado, numero_candidato, numero_partido, codigo_municipio)
    print baseURL + request
    #filename = hashlib.md5(request).hexdigest() + ".gz"
    #response = urllib2.urlopen(baseURL + request)
    #save_cache(response, filename)
    # return pd.read_csv(os.path.join(baseDir, "cache/" + filename), sep=",", dtype=str)


votos(1, 2010, 2, 7, 'SP', 45, 45)    