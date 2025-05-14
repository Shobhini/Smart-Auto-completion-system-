#include <unordered_map>
#include <string>
using namespace std;
class Typos{
public:
    unordered_map<char,string>neighbours;
    Typos(){
        neighbours['a'] = "qwsz";
        neighbours['b'] = "vghn";
        neighbours['c'] = "xdfv";
        neighbours['d'] = "serfcx";
        neighbours['e'] = "wsdr";
        neighbours['f'] = "drtgvc";
        neighbours['g'] = "ftyhbv";
        neighbours['h'] = "gyujnb";
        neighbours['i'] = "ujko";
        neighbours['j'] = "hukmni";
        neighbours['k'] = "jiolm";
        neighbours['l'] = "kop";
        neighbours['m'] = "njk";
        neighbours['n'] = "bhjm";
        neighbours['o'] = "iklp";
        neighbours['p'] = "ol";
        neighbours['q'] = "aw";
        neighbours['r'] = "edft";
        neighbours['s'] = "awedxz";
        neighbours['t'] = "rfgy";
        neighbours['u'] = "yhji";
        neighbours['v'] = "cfgb";
        neighbours['w'] = "qase";
        neighbours['x'] = "zsdc";
        neighbours['y'] = "tghu";
        neighbours['z'] = "asx";
    }
};